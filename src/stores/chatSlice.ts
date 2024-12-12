import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';
import { sendMessage as sendWebSocketMessage } from '../services/chatService';

// Định nghĩa kiểu cho Message
interface Message {
    id?: string;
    senderId: number;
    receiverId: number;
    listingId: number;
    content: string;
    timestamp: string;
}

// Định nghĩa kiểu cho Chat
interface Chat {
    listingId: number;
    otherUserId: number;
    lastMessageContent: string;
    lastMessageTime: string;
    [key: string]: any;
}

// Định nghĩa kiểu state của chat
interface ChatState {
    messages: Message[];
    loadedChats: string[];
    messagesByChatKey: { [key: string]: Message[] };
    listingMessages: Message[];
    loading: boolean;
    error: string | null;
    currentListingId: number | null;
    connectionStatus: 'disconnected' | 'connecting' | 'connected';
    userChats: Chat[];
    currentUserId: number | null;
}

// Khởi tạo state ban đầu
const initialState: ChatState = {
    messages: [],
    loadedChats: [],
    messagesByChatKey: {},
    listingMessages: [],
    loading: false,
    error: null,
    currentListingId: null,
    connectionStatus: 'disconnected',
    userChats: [],
    currentUserId: null,
};

// Async action: Fetch messages
export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (
        {
            senderId,
            receiverId,
            listingId,
            chatKey,
        }: { senderId: number; receiverId: number; listingId: number; chatKey: string },
        thunkAPI
    ) => {
        try {
            const response = await api.get('/chat/messages', {
                params: { senderId, receiverId, listingId },
            });
            return {
                messages: response.data,
                chatKey,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch messages');
        }
    }
);

// Async action: Fetch all messages for a listing
export const fetchAllListingMessages = createAsyncThunk(
    'chat/fetchListingMessages',
    async (listingId: number, thunkAPI) => {
        try {
            const response = await api.get(`/chat/listing/${listingId}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch listing messages');
        }
    }
);

// Async action: Send a message
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (chatMessageDTO: Message, thunkAPI) => {
        try {

            await sendWebSocketMessage(chatMessageDTO);
            return chatMessageDTO;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to send message');
        }
    }
);

// Async action: Fetch user chats
export const fetchUserChats = createAsyncThunk(
    'chat/fetchUserChats',
    async (userId: number, thunkAPI) => {
        try {
            const response = await api.get(`/chat/user-chats?userId=${userId}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch user chats');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentUserId: (state, action: PayloadAction<number | null>) => {
            state.currentUserId = action.payload;
        },
        addMessage: (state, action: PayloadAction<{ message: Message }>) => {
            const { message } = action.payload;
            const currentUserId = state.currentUserId;

            if (!currentUserId || (message.senderId !== currentUserId && message.receiverId !== currentUserId)) {
                return;
            }

            const messageKey = `${message.senderId}_${message.receiverId}_${message.listingId}`;
            const reverseMessageKey = `${message.receiverId}_${message.senderId}_${message.listingId}`;

            [messageKey, reverseMessageKey].forEach((key) => {
                if (!state.messagesByChatKey[key]) {
                    state.messagesByChatKey[key] = [];
                }

                const isDuplicate = state.messagesByChatKey[key].some(
                    (msg) =>
                        (msg.id && msg.id === message.id) ||
                        (msg.content === message.content &&
                            msg.timestamp === message.timestamp &&
                            msg.senderId === message.senderId)
                );

                if (!isDuplicate) {
                    state.messagesByChatKey[key] = [...state.messagesByChatKey[key], message];
                }
            });

            const otherUserId =
                message.senderId === currentUserId ? message.receiverId : message.senderId;

            const existingChat = state.userChats.find(
                (chat) => chat.listingId === message.listingId && chat.otherUserId === otherUserId
            );

            if (existingChat) {
                existingChat.lastMessageContent = message.content;
                existingChat.lastMessageTime = message.timestamp;
            } else {
                const listingInfo = JSON.parse(
                    localStorage.getItem(`listing_${message.listingId}_${otherUserId}`) || '{}'
                );

                if (listingInfo) {
                    state.userChats.unshift({
                        ...listingInfo,
                        lastMessageContent: message.content,
                        lastMessageTime: message.timestamp,
                    });
                }
            }
        },
        clearMessages: (state, action: PayloadAction<string>) => {
            const chatKey = action.payload;
            if (chatKey) {
                state.messagesByChatKey[chatKey] = [];
            }
        },
        setConnectionStatus: (state, action: PayloadAction<'disconnected' | 'connecting' | 'connected'>) => {
            state.connectionStatus = action.payload;
            if (action.payload === 'disconnected') {
                console.warn('WebSocket is disconnected. Retrying connection...');
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserChats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserChats.fulfilled, (state, action: PayloadAction<Chat[]>) => {
                state.loading = false;
                state.userChats = action.payload;
            })
            .addCase(fetchUserChats.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action: PayloadAction<{ messages: Message[]; chatKey: string }>) => {
                const { messages, chatKey } = action.payload;
                state.loading = false;
                state.messagesByChatKey[chatKey] = messages.sort(
                    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
                if (!state.loadedChats.includes(chatKey)) {
                    state.loadedChats.push(chatKey);
                }
            })
            .addCase(fetchMessages.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllListingMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllListingMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
                state.loading = false;
                state.listingMessages = action.payload;
            })
            .addCase(fetchAllListingMessages.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
                const { chatKey } = action.payload;
                if (!state.messagesByChatKey[chatKey]) {
                    state.messagesByChatKey[chatKey] = [];
                }
                state.messagesByChatKey[chatKey].push(action.payload);
            });
    },
});

export const { addMessage, setConnectionStatus, clearMessages, setCurrentUserId } = chatSlice.actions;

export default chatSlice.reducer;

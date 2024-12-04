import React, {useCallback, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessages, fetchMessages, sendMessage } from '../../stores/chatSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { RootState, AppDispatch } from '../../stores/store';
import {getCurrentUser, User} from "../../api/user.ts";
import api from "../../services/api.ts";

interface ChatWindowProps {
    listingId: number;
    otherUserId: number;
    chatKey: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ listingId, otherUserId, chatKey }) => {
    const dispatch = useDispatch<AppDispatch>();
    const messages = useSelector((state: RootState) => state.chat.messagesByChatKey[chatKey] || []);
    const { loading, error } = useSelector((state: RootState) => state.chat);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (user?.id && otherUserId && listingId) {
            dispatch(fetchMessages({
                senderId: user.id,
                receiverId: otherUserId,
                listingId,
                chatKey
            }));
        }

        return () => {
            dispatch(clearMessages(chatKey));
        };
    }, [dispatch, user?.id, otherUserId, listingId, chatKey]);

    const uploadFiles = async (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        const response = await api.post('/chat/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    };

    const handleSendMessage = useCallback(async (content, files) => {
        if (user?.id && otherUserId && listingId) {
            const fileUrls = files.length > 0 ? await uploadFiles(files) : [];

            const chatMessageDTO = {
                content,
                senderId: user.id,
                receiverId: otherUserId,
                listingId,
                fileUrls,
                timestamp: new Date().toISOString(),
                chatKey,
            };

            await dispatch(sendMessage(chatMessageDTO)).unwrap();
            try {
                dispatch(fetchMessages({
                    senderId: user.id,
                    receiverId: otherUserId,
                    listingId,
                    chatKey
                }));
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    }, [dispatch, user?.id, otherUserId, listingId, chatKey]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Error: {error || 'Something went wrong'}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full  bg-white rounded-lg shadow-lg">
            <div className="flex-1 p-4 overflow-y-auto">
                <MessageList
                    messages={messages}
                    currentUserId={user?.id || null}
                    height={300}
                />
            </div>
            <div className="border-t p-4">
                <MessageInput onSendMessage={handleSendMessage}/>
            </div>
        </div>
    );
};

export default React.memo(ChatWindow);
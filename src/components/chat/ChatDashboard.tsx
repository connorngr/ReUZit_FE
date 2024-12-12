import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useLocation} from 'react-router-dom';
import { fetchUserChats, setCurrentUserId } from '../../stores/chatSlice';
import { connectToChat } from '../../services/chatService';
import ChatWindow from './ChatWindow';
import ChatList from './ChatList';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { AppDispatch, RootState } from '../../stores/store';
import {getCurrentUser, User} from "../../api/user.ts";
import {getListingById, Listing} from '../../api/listing';

interface Chat {
    listingId: number;
    otherUserId: number;
    otherUserName: string;
    listingTitle: string;
    listingImageUrl: string;
    lastMessageTime?: string;
    isNewChat?: boolean;
}

const ChatDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const userChats = useSelector((state: RootState) => state.chat.userChats);
    const [listing, setListing] = useState<Listing | null>(null);
    const [selectedChatKey, setSelectedChatKey] = useState<string>('');
    const [queryChat, setQueryChat] = useState<Chat | null>(null);
    const [chatListSize, setChatListSize] = useState(() => {
        return parseInt(localStorage.getItem('chatListSize') || '25', 10);
    });

    const handleResize = (sizes: number[]) => {
        const newSize = sizes[0];
        setChatListSize(newSize);
        localStorage.setItem('chatListSize', newSize.toString());
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const listingId = searchParams.get('listingId');

        const fetchingUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error initializing chat:', error);
            }
        };

        fetchingUser();

        const fetchListing = async () => {
            try {
                // Fetch listing details
                const data = await getListingById(Number(listingId));
                setListing(data);

            } catch (error) {
                console.error('Error fetching listing:', error);
            }
        };
        fetchListing();
    }, []);

    useEffect(() => {
        connectToChat(dispatch);
        if (user?.id) {
            dispatch(setCurrentUserId(user.id));
            dispatch(fetchUserChats(user.id));
        }
    }, [dispatch, user?.id]);

    useEffect(() => {
        return () => {
            const keys = Object.keys(localStorage);
            keys.forEach((key) => {
                if (key.startsWith('listing_')) {
                    localStorage.removeItem(key);
                }
            });
        };
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const listingId = searchParams.get('listingId');
        const otherUserId = searchParams.get('otherUserId');

        if (listingId && otherUserId && user?.id) {
            const chatKey = `${user.id}_${otherUserId}_${listingId}`;
            setSelectedChatKey(chatKey);

            const existingChat = userChats.find(
                chat => chat.listingId === Number(listingId) &&
                    chat.otherUserId === Number(otherUserId)
            );

            if (!existingChat && listing) {
                const listingInfo = {
                    listingId: Number(listingId),
                    otherUserId: Number(otherUserId),
                    otherUserName: listing.username,
                    listingTitle: listing.title,
                    listingImageUrl: listing.images[0].url
                };
                localStorage.setItem(`listing_${listingId}_${otherUserId}`, JSON.stringify(listingInfo));

                setQueryChat(listingInfo);
            }
        }
    }, [location.search, user?.id, userChats, listing]);

    const allChats = useMemo(() => {
        if (!queryChat) return userChats;

        const existingChat = userChats.find(
            chat => chat.listingId === queryChat.listingId &&
                chat.otherUserId === queryChat.otherUserId
        );

        if (existingChat) return userChats;

        return [{
            ...queryChat,
            lastMessageTime: new Date().toISOString(),
            isNewChat: true
        }, ...userChats];
    }, [userChats, queryChat]);

    const handleChatSelect = useCallback((chat) => {
        if (!chat || !user?.id) return;

        const chatKey = `${user.id}_${chat.otherUserId}_${chat.listingId}`;
        setSelectedChatKey(chatKey);

        // Update URL without causing a page reload
        const searchParams = new URLSearchParams();
        searchParams.set('listingId', chat.listingId.toString());
        searchParams.set('otherUserId', chat.otherUserId.toString());
        searchParams.set('listingImageUrl', chat.listingImageUrl.toString());
        searchParams.set('listingTitle', chat.listingTitle.toString());
        window.history.pushState({}, '', `?${searchParams.toString()}`);
    }, [user?.id]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-600">Please login to access chat.</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-100">
            <PanelGroup direction="horizontal" onLayout={handleResize}>
                <Panel defaultSize={chatListSize} minSize={20} maxSize={40}>
                    <div className="h-full border-r border-gray-200 overflow-y-auto">
                        <ChatList
                            chats={allChats}
                            onChatSelect={handleChatSelect}
                            selectedChatKey={selectedChatKey}
                            currentUserId={user?.id}
                        />
                    </div>
                </Panel>

                <PanelResizeHandle className="w-1 hover:bg-blue-500 bg-gray-200 cursor-col-resize"/>

                <Panel>
                    <div className="h-full">
                        {selectedChatKey ? (
                            <ChatWindow
                                key={selectedChatKey}
                                listingId={Number(selectedChatKey.split('_')[2])}
                                otherUserId={Number(selectedChatKey.split('_')[1])}
                                chatKey={selectedChatKey}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Select a chat to start messaging
                            </div>
                        )}
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}

export default React.memo(ChatDashboard);
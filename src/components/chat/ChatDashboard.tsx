import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useLocation, useSearchParams} from 'react-router-dom';
import { fetchUserChats, setCurrentUserId } from '../../stores/chatSlice';
import { connectToChat } from '../../services/chatService';
import ChatWindow from './ChatWindow';
import ChatList from './ChatList';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { AppDispatch, RootState } from '../../stores/store';
import {getCurrentUser, User, getUserById} from "../../api/user.ts";
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
    var [searchParams] = useSearchParams();
    
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    var listingId = searchParams.get('listingId');
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
        return () => {
            Object.keys(localStorage)
                .filter(key => key.startsWith('listing_'))
                .forEach(key => localStorage.removeItem(key));
        };
    }, []);
    

    useEffect(() => {
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
            searchParams = new URLSearchParams(location.search);
            listingId = searchParams.get('listingId');
        
            if (!listingId || isNaN(Number(listingId))) {
                console.error('Invalid listingId:', listingId);
                return;
            }
        
            try {
                const data = await getListingById(Number(listingId)); // Make sure this API handles all scenarios
                const dataUser = await getUserById(data.userId);
        
                console.log("id:" + data.userId + " and Name: " + `${dataUser.firstName} ${dataUser.lastName}`);
                const updatedListing = {
                    ...data,
                    username: `${dataUser.firstName} ${dataUser.lastName}`,
                };
        
                setListing(updatedListing);
            } catch (error) {
                console.error('Error fetching listing:', error); // Log the error for debugging
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

    // useEffect(() => {
    //     return () => {
    //         const keys = Object.keys(localStorage);
    //         keys.forEach((key) => {
    //             if (key.startsWith('listing_')) {
    //                 localStorage.removeItem(key);
    //             }
    //         });
    //     };
    // }, []);

    useEffect(() => {
        return () => {
            Object.keys(localStorage)
                .filter(key => key.startsWith('listing_'))
                .forEach(key => localStorage.removeItem(key));
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
            const updatedChat = {
                listingId: Number(listingId),
                otherUserId: Number(otherUserId),
                otherUserName: listing.username || 'Unknown User', // Updated to include username
                listingTitle: listing.title,
                listingImageUrl: listing.images[0]?.url || '',
            };
            localStorage.setItem(`listing_${listingId}_${otherUserId}`, JSON.stringify(updatedChat));
            setQueryChat(updatedChat);
        }
    }
}, [location.search, user?.id, userChats, listing]);


    const allChats = useMemo(() => {
        if (!queryChat) return userChats;

        const existingChat = userChats.find(
            chat => chat.listingId === queryChat.listingId &&
                chat.otherUserId === queryChat.otherUserId
        );

        if (existingChat) {
            // Update existing chat if username is stale
            if (existingChat.otherUserName !== queryChat?.otherUserName) {
                existingChat.otherUserName = queryChat?.otherUserName || existingChat.otherUserName;
            }
            return userChats;
        }

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
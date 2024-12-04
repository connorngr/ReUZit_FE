import React from 'react';
import { formatDistanceToNow } from 'date-fns';

// Định nghĩa kiểu cho props
interface Chat {
    listingId: number;
    otherUserId: number;
    otherUserName: string;
    listingTitle: string;
    listingImageUrl: string;
    lastMessageTime?: string;
    lastMessageContent?: string;
}

interface ChatListProps {
    chats: Chat[];
    onChatSelect: (chat: Chat) => void;
    selectedChatKey: string;
    currentUserId: number;
}

const ChatList: React.FC<ChatListProps> = ({
                                               chats,
                                               onChatSelect,
                                               selectedChatKey,
                                               currentUserId,
                                           }) => {
    // Sắp xếp chats theo thời gian tin nhắn cuối cùng
    const sortedChats = [...chats].sort((a, b) =>
        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    return (
        <div className="bg-white">
            <h2 className="text-xl font-bold p-4 border-b">Your Chats</h2>
            {sortedChats.map(chat => (
                <div
                    key={`${chat.listingId}_${chat.otherUserId}`}
                    onClick={() => onChatSelect(chat)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                        selectedChatKey === `${currentUserId}_${chat.otherUserId}_${chat.listingId}`
                            ? 'bg-blue-100'
                            : ''
                    }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-3">
                            <h3 className="font-semibold text-gray-800">
                                {chat.otherUserName}
                            </h3>
                            <p className="text-sm font-medium text-gray-600 truncate">
                                {chat.listingTitle}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                                {chat.lastMessageContent || 'Start a conversation'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {chat.lastMessageTime
                                    ? formatDistanceToNow(new Date(chat.lastMessageTime), {addSuffix: true})
                                    : 'New'
                                }
                            </p>
                        </div>

                        <div className="w-16 h-16 flex-shrink-0">
                            <img
                                src={`http://localhost:8080${chat.listingImageUrl}`}
                                alt="Listing"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default React.memo(ChatList);
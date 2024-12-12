import React, {useCallback, useEffect, useRef, useState} from 'react';
import { VariableSizeList as List } from 'react-window';
import ImageViewerModal from "./ImageViewerModal.tsx";

interface Message {
    senderId: number;
    content: string;
    fileUrls?: string[];
    timestamp?: string;
}

interface MessageListProps {
    messages: Message[];
    currentUserId: number | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
    const listRef = useRef<List>(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const openImageViewer = (url) => {
        setSelectedImage(`http://localhost:8080${url}`);
    };

    useEffect(() => {
        if (listRef.current && messages.length > 0) {
            listRef.current.scrollToItem(messages.length - 1);
            // Cần reset cache khi messages thay đổi
            listRef.current.resetAfterIndex(0);
        }
    }, [messages.length]);

    const getItemSize = (index) => {
        const message = messages[index];
        if (!message) return 80;

        const hasImages = message.fileUrls.length > 0;
        const imageRows = Math.ceil(message.fileUrls.length / 4);
        const baseHeight = 80;
        const imageHeight = 175;
        const spacing = 16;

        let totalHeight;
        if (message.content && hasImages) {
            totalHeight = baseHeight + (imageHeight * imageRows) + spacing;
        } else if (hasImages) {
            totalHeight = (imageHeight * imageRows) + spacing;
        } else {
            totalHeight = baseHeight;
        }

        return totalHeight + spacing;
    };

    const Row = useCallback(({index, style}) => {
        if (!messages?.[index]) return null;
        const message = messages[index];
        const hasImages = message.fileUrls.length > 0;
        const imageRows = Math.ceil(message.fileUrls.length / 4);
        const baseHeight = 80;
        const imageHeight = 175;
        const spacing = 16;

        const totalHeight = message.content && hasImages
            ? baseHeight + (imageHeight * imageRows) + spacing
            : hasImages
                ? (imageHeight * imageRows) + spacing
                : baseHeight;

        return (
            <div
                style={{
                    ...style,
                    height: totalHeight,
                    display: 'flex',
                    justifyContent: message?.senderId === currentUserId ? 'flex-end' : 'flex-start',
                    padding: '8px',
                    paddingRight: '16px',
                    boxSizing: 'border-box'
                }}
            >
                <div className={`max-w-[70%] ${!hasImages ? 'p-3 rounded-lg' : ''} ${
                    !hasImages ?
                        message?.senderId === currentUserId
                            ? 'bg-blue-500 text-white mr-2'
                            : 'bg-gray-200 text-gray-800 ml-2'
                        : ''
                }`}>
                    {message?.content && (
                        <div className="break-words mb-2">
                            {message.content}
                        </div>
                    )}

                    {hasImages && (
                        <div className="flex flex-wrap justify-end gap-2"> {/* Điều chỉnh gap */}
                            {message.fileUrls.map((url, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => openImageViewer(url)}
                                    className="cursor-pointer flex items-center justify-center"
                                    style={{
                                        width: '175px',
                                        height: '175px'
                                    }}
                                >
                                    <img
                                        src={`http://localhost:8080${url}`}
                                        alt="attachment"
                                        className="w-full h-full rounded-lg object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {message?.timestamp && (
                        <div className={`text-xs opacity-70 mt-1 ${
                            message?.senderId === currentUserId ? 'text-right' : 'text-left'
                        }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }, [currentUserId, messages]);

    if (!Array.isArray(messages)) {
        return <div>No messages to display</div>;
    }

    return (
        <>
            <List
                ref={listRef}
                height={window.innerHeight - 220}
                itemCount={messages.length}
                itemSize={getItemSize}
                width="100%"
                overscanCount={5}
                className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
            >
                {Row}
            </List>

            {selectedImage && (
                <ImageViewerModal
                    url={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </>
    );
};

export default React.memo(MessageList);

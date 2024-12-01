import React, { useCallback, useRef, useState } from 'react';

interface MessageInputProps {
    onSendMessage: (message: string, files: File[]) => void;
}

const MAX_TOTAL_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<(string | null)[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (message.trim() || files.length > 0) {
            onSendMessage(message.trim(), files);
            setMessage('');
            setFiles([]);
            setPreviews([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [message, files, onSendMessage]);

    const handleFileChange = useCallback((e) => {
        const selectedFiles = Array.from(e.target.files);
        const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

        // Kiểm tra xem tất cả files có phải là hình ảnh không
        const areAllImages = selectedFiles.every(file => file.type.startsWith('image/'));

        if (!areAllImages) {
            alert('Chỉ chấp nhận file hình ảnh.');
            e.target.value = ''; // Reset input
            return;
        }

        if (totalSize <= MAX_TOTAL_FILE_SIZE) {
            setFiles(selectedFiles);
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        } else {
            alert('Total file size exceeds 20MB limit.');
            e.target.value = ''; // Reset input
        }
    }, []);

    const removeFile = useCallback((index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviews(prevPreviews => {
            // Revoke URL để tránh memory leak
            if (prevPreviews[index]) URL.revokeObjectURL(prevPreviews[index]);
            return prevPreviews.filter((_, i) => i !== index);
        });
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="flex items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="fileInput" className="p-2 bg-gray-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                    </svg>
                    <input
                        type="file"
                        id="fileInput"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx"
                        multiple
                        className="hidden"
                    />
                </label>
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600">
                    Send
                </button>
            </div>
            {files.length > 0 && (
                <div className="mt-2">
                    <p className="text-sm text-gray-500">Selected files: {files.length}</p>
                </div>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
                {previews.map((preview, index) => (
                    preview && (
                        <div key={index} className="relative w-20 h-20">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded"/>
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                    )
                ))}
            </div>
        </form>
    );
}

export default React.memo(MessageInput);
// ImageViewerModal.js
import React from 'react';

function ImageViewerModal({ url, onClose }) {

    const handleDownload = async () => {
        try {
            // Lấy tên file từ URL
            const fileName = url.split('/').pop() || 'downloaded-image';

            // Tải file
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            // Tạo link download
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);

            // Mở hình trong tab mới
            window.open(url, '_blank');
        } catch (error) {
            console.error('Download failed:', error);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="absolute top-4 right-4 flex gap-4">
                <button
                    onClick={onClose}
                    className="bg-white p-2 rounded-full hover:bg-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <button
                    onClick={handleDownload}
                    className="bg-white p-2 rounded-full hover:bg-gray-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>
            </div>
            <img
                src={url}
                alt="Full size"
                className="max-h-[90vh] max-w-full"
            />
        </div>
    );
}

export default ImageViewerModal;
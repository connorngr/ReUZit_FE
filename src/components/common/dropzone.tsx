import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface MyDropzoneProps {
    setImageUrl: (file: File | null) => void; // Điều chỉnh prop để nhận File
}

const MyDropzone: React.FC<MyDropzoneProps> = ({ setImageUrl }) => {
    const [preview, setPreview] = useState<string | null>(null); // Trạng thái lưu URL tạm thời

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImageUrl(file); // Lưu file qua prop
            setPreview(URL.createObjectURL(file)); // Tạo URL tạm thời để hiển thị
        }
    }, [setImageUrl]);

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }, // Chỉ chấp nhận hình ảnh
        maxFiles: 1,
        noClick: true, // Ngăn Dropzone tự động mở trình chọn file
        noKeyboard: true, // Tắt hỗ trợ bàn phím
    });

    return (
        <div {...getRootProps()} 
        style={{ border: '2px dashed #007bff', padding: '20px', textAlign: 'center' }}
        onClick={open}
        >
            <input {...getInputProps()} />
            {preview ? (
                <div onClick={open} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            borderRadius: '8px',
                            marginBottom: '10px',
                        }}
                    />
                    <p>Click to change image</p>
                </div>
            ) : (
                // Hiển thị nội dung mặc định khi chưa chọn
                <p>Drag 'n' drop an image here, or click to select one</p>
            )}
        </div>
    );
};

export default MyDropzone;

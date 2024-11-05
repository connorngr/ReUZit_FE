// import React, { useCallback } from 'react'
// import { useDropzone } from 'react-dropzone'

// const MyDropzone: React.FC = () => {
//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     console.log(acceptedFiles) // Xử lý các file nhận được
//     // Ví dụ: Upload lên server hoặc xử lý file
//   }, [])

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

//   return (
//     <div {...getRootProps()} style={{ border: '2px dashed #007bff', padding: '20px', textAlign: 'center' }}>
//       <input {...getInputProps()} />
//       {
//         isDragActive ? (
//           <p>Drop the files here ...</p>
//         ) : (
//           <p>Drag 'n' drop some files here, or click to select files</p>
//         )
//       }
//     </div>
//   )
// }

// export default MyDropzoneimport React, { useCallback } from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface MyDropzoneProps {
    setImageUrl: (file: File | null) => void; // Điều chỉnh prop để nhận File
}

const MyDropzone: React.FC<MyDropzoneProps> = ({ setImageUrl }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImageUrl(file); // Lưu File thay vì URL
        }
    }, [setImageUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }, // Chỉ chấp nhận hình ảnh
        maxFiles: 1
    });

    return (
        <div {...getRootProps()} style={{ border: '2px dashed #007bff', padding: '20px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
            )}
        </div>
    );
};

export default MyDropzone;

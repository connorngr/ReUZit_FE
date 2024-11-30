import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

// Dropzone cho một tệp
interface SingleFileDropzoneProps {
  setImageUrl: (file: File | null) => void;
}

export const SingleFileDropzone: React.FC<SingleFileDropzoneProps> = ({ setImageUrl }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageUrl(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [setImageUrl]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #007bff",
        padding: "20px",
        textAlign: "center",
        borderRadius: "8px",
      }}
      onClick={open}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div style={{ cursor: "pointer", textAlign: "center" }} onClick={open}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
          <p>Click to change image</p>
        </div>
      ) : (
        <p>Drag 'n' drop an image here, or click to select one</p>
      )}
    </div>
  );
};

// Dropzone cho nhiều tệp
interface MultipleFilesDropzoneProps {
  setImages: (files: File[]) => void;
}

export const MultipleFilesDropzone: React.FC<MultipleFilesDropzoneProps> = ({ setImages }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImages(acceptedFiles);
      setPreviews(acceptedFiles.map((file) => URL.createObjectURL(file)));
    },
    [setImages]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    noClick: true,
    noKeyboard: true,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #007bff",
        padding: "20px",
        textAlign: "center",
        borderRadius: "8px",
      }}
      onClick={open}
    >
      <input {...getInputProps()} />
      {previews.length > 0 ? (
        <div style={{ textAlign: "center" }}>
          <div className="grid grid-cols-3 gap-2">
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100px",
                  borderRadius: "4px",
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
          <p style={{ marginTop: "10px" }}>Click to add or replace images</p>
        </div>
      ) : (
        <p>Drag 'n' drop images here, or click to select files</p>
      )}
    </div>
  );
};


import React, { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};
const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState<File[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", "svg"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-8">
            <img
              src={fileUrl}
              alt="uploaded image"
              className="file_uploader-img"
            />
          </div>
          <p className="file_uploader-label">Drag or Click photo to replace</p>
        </>
      ) : (
        <div className="file_uploader p-10">
          {" "}
          <img
            src="/assets/icons/file-upload.svg"
            width={120}
            alt="Upload File"
          />
          <h3 className="mb-3 mt-4 base-medium">Drag Photo Here</h3>
          <p className="base-medium text-light-3 small-regular mb-6">
            PNG,SVG,JPG
          </p>
          <Button className="shad-button_dark_4 mb-5 p-6">Browse File</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;

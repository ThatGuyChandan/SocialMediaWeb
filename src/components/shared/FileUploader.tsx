import { useCallback, useState } from "react";
import { FileWithPath, useDropzone, FileRejection } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const ACCEPTED_TYPES = [".jpg", ".jpeg", ".png"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      setError("");
      if (fileRejections && fileRejections.length > 0) {
        const reason = fileRejections[0].errors[0].message;
        setError(reason);
        return;
      }
      const selected = acceptedFiles[0];
      if (!selected) return;
      // Extra check for type and size
      const ext = selected.name.substring(selected.name.lastIndexOf(".")).toLowerCase();
      if (!ACCEPTED_TYPES.includes(ext)) {
        setError("Only JPG and PNG files are allowed.");
        return;
      }
      if (selected.size > MAX_SIZE) {
        setError("File size must be less than 5MB.");
        return;
      }
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(selected));
    },
    [fieldChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": ACCEPTED_TYPES,
    },
    maxFiles: 1,
    maxSize: MAX_SIZE,
  });
  return (
    <div
      {...getRootProps()}
      className={`transition-all duration-200 w-full max-w-lg mx-auto flex flex-center flex-col bg-dark-3 rounded-2xl shadow-lg border-2 border-dashed border-primary-500 cursor-pointer p-6 md:p-10 min-h-[250px] md:min-h-[320px] hover:shadow-2xl ${isDragActive ? "bg-primary-900/20 border-primary-400" : ""}`}
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-2 md:p-5 lg:p-8">
            <img
              src={fileUrl}
              alt="uploaded image"
              className="file_uploader-img rounded-xl max-h-60 md:max-h-80 object-contain border border-dark-4 shadow-md"
            />
          </div>
          <p className="file_uploader-label text-center text-light-3 mt-2">Drag or Click photo to replace</p>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 py-6">
          <img
            src="/assets/icons/file-upload.svg"
            width={80}
            alt="Upload File"
            className="mb-2 opacity-80"
          />
          <h3 className="mb-1 mt-2 text-lg font-semibold text-light-1">Drag & Drop or Click to Upload</h3>
          <p className="text-light-3 text-sm mb-2">JPG, PNG only (Max 5MB)</p>
          <Button className="shad-button_dark_4 px-8 py-2 text-base">Browse File</Button>
        </div>
      )}
      {error && <div className="text-red-400 bg-red-900/20 border border-red-500 rounded-lg px-4 py-2 mt-4 text-center text-sm font-medium w-full max-w-xs mx-auto">{error}</div>}
    </div>
  );
};

export default FileUploader;

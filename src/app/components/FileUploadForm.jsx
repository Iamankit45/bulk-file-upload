'use client';

import { useState } from 'react';
import StatusBar from './StatusBar';
import { AiOutlineCloudUpload } from 'react-icons/ai';

export default function FileUploadForm() {
    const [files, setFiles] = useState([]);
    const [statuses, setStatuses] = useState({});

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("Please select files");
            return;
        }

        files.forEach(async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            setStatuses((prev) => ({ ...prev, [file.name]: "uploading" }));

            try {
                const response = await fetch("/api/upload", { method: "POST", body: formData });
                const result = await response.json();

                if (result.status === 200) {
                    const uploadedFile = result.data.find(f => f.fileName === file.name);

                    if (uploadedFile) {
                        const fileId = uploadedFile.fileId;
                        console.log(`File uploaded: ${fileId}`);
                        setStatuses((prev) => ({ ...prev, [file.name]: "uploaded" }));

                        const interval = setInterval(async () => {
                            try {
                                const statusResponse = await fetch(`/api/status/${fileId}`);
                                const statusResult = await statusResponse.json();
                                setStatuses((prev) => ({ ...prev, [file.name]: statusResult.status }));

                                if (["completed", "failed"].includes(statusResult.status)) {
                                    clearInterval(interval);
                                }
                            } catch (error) {
                                console.error(`Error fetching status for ${file.name}:`, error);
                            }
                        }, 500);
                    } else {
                        console.error("File ID not found for uploaded file.");
                    }
                } else {
                    console.error("Unexpected response format or upload failed:", result);
                }
            } catch (error) {
                setStatuses((prev) => ({ ...prev, [file.name]: "failed" }));
                console.error(`Upload error for ${file.name}:`, error);
            }
        });
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
            <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-md py-10 px-4 cursor-pointer hover:bg-gray-50">
                    <AiOutlineCloudUpload size={48} className="text-blue-600" />
                    <span className="mt-2 text-gray-600">Choose files</span>
                    <input type="file" multiple onChange={handleFileChange} className="hidden" />
                </label>
                <button
                    onClick={handleUpload}
                    className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600"
                >
                    Upload All
                </button>
            </div>

            <div className="mt-6 space-y-4">
                {files.map((file) => (
                    <div key={file.name} className="border p-4 rounded-md">
                        <p className="text-gray-700 font-medium">{file.name}</p>
                        <StatusBar status={statuses[file.name]} />
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import StatusBar from './StatusBar';
import { AiOutlineCloudUpload } from 'react-icons/ai';


export default function FileUploadForm() {

    console.log('Client-side FileUploadForm is executing');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [fileId, setFileId] = useState(null);

    

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };


    const handleUpload = async () => {
        
        if (!file) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);


        try {

            setStatus("Uploading...");       
            const response = await fetch("/api/upload", { method: "POST", body: formData });           
            const result = await response.json();
                     
            setFileId(result.data.fileId);
            setStatus(result.message);
        } catch (error) {
            setStatus('Upload failed');
            console.error('Upload error:', error);
        }
    }

    useEffect(() => {

        if (fileId) {
           
            const interval = setInterval(async () => {
                try {
                    
                    const response = await fetch(`/api/status/${fileId}`);
                    const result = await response.json();
                    setStatus(result.status);

                    if (['completed', 'failed'].includes(result.status)) {
                        clearInterval(interval);
                    }
                } catch (error) {
                    console.error('Error fetching status:', error);
                }
            }, 500);

            return () => clearInterval(interval);
        }


    }, [fileId]);


    return (

        <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-4">
        <label
          className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-md py-10 px-4 cursor-pointer hover:bg-gray-50"
        >
        <AiOutlineCloudUpload size={48} className="text-blue-600" />
        <span className="mt-2 text-gray-600">{file?.name || "Choose a file"}</span>
        <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600"
        >Upload</button></div><StatusBar status={status} /></div>


        
    )
}
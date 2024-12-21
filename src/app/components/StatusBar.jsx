'use client';

import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

export default function StatusBar({ status }) {
  const getProgress = () => {
    switch (status) {
      case "uploading":
        return 20;
      case "uploaded":
        return 40;
      case "processing":
        return 60;
      case "validating":
        return 80;
      case "completed":
        return 100;
      case "failed":
        return 0;
      default:
        return 0;
    }
  };

  const getIcon = () => {
    switch (status) {
      case "uploading":
      case "processing":
      case "validating":
        return <FaHourglassHalf className="text-yellow-500" size={24} />;
      case "completed":
        return <FaCheckCircle className="text-green-500" size={24} />;
      case "failed":
        return <FaTimesCircle className="text-red-500" size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <p className="text-lg text-gray-700 capitalize">{status || "Idle"}</p>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getProgress() === 100 ? "bg-green-500" : "bg-blue-500"
            }`}
          style={{ width: `${getProgress()}%` }}
        ></div>
        <p className="absolute top-[-20px] right-0 text-sm text-gray-500">{getProgress()}%</p>
      </div>
    </div>
  );
}
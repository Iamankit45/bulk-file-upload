'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-semibold mb-6">Welcome to the Bulk File Upload System</h2>
      <p className="text-gray-700 mb-6">
        Upload your files in bulk, track their progress in real-time, and enjoy seamless processing.
      </p>
      <Link href="/upload">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
          Go to Upload Page
        </button>
      </Link>
    </div>
  );
}

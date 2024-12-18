import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bulk File Upload System",
  description: "Upload and process bulk files with live status updates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl">File Upload System</h1>
        </header>
        <main className="container mx-auto mt-4">{children}</main>
      </body>
    </html>
  );
}

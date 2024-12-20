import FileUploadForm from '@/app/components/FileUploadForm';

export default function UploadPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center mb-6">Bulk File Upload</h1>
      <FileUploadForm />
    </main>
  );
}

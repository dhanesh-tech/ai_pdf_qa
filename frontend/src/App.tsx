import "./App.css";
import UploadPdfComponent from "./components/UploadPdfComponent";
import ShowChatAndPdf from "./components/ShowChatAndPdf";
import { useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleUploadSuccess = (
    file: File,
  ) => {
    setFile(file);
  };

  const clearFile = () => {
    setFile(null);
  };

  console.log(" app.js : file")
  return (
    <>
      {file ? (
        <ShowChatAndPdf file={file} onClearFile={clearFile} />
      ) : (
        <UploadPdfComponent onUploadSuccess={handleUploadSuccess} />
      )}
    </>
  );
}

export default App;

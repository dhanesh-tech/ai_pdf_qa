import { useState } from 'react'
import ChatInterface from './ChatInterface'
import PdfViewer from './PdfViewer'

interface ShowChatAndPdfProps {
  file: File
  onClearFile: () => void
}

function ShowChatAndPdf({ file, onClearFile }: ShowChatAndPdfProps) {
  const [page, setPage] = useState<{page: number} >({page: 1});
  const fileUrl = URL.createObjectURL(file) 

  const handlePageClick = (page: number) => {
    console.log(`Navigating to page ${page}`);
    if(page > 0){
      setPage((prev)=> ({...prev, page: page}));
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 gap-4">
      <div className="w-2/5 min-w-80">
        <ChatInterface handlePageClick={handlePageClick} onClearFile={onClearFile} />
      </div>
      <div className="flex-1">
        <PdfViewer 
          fileUrl={fileUrl}
          page={page}
        />
      </div>
    </div>
  )
}

export default ShowChatAndPdf
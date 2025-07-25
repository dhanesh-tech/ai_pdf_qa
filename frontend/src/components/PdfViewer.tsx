import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useEffect } from 'react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './PdfViewer.css';

type Props = {
    fileUrl: string;
    page: {page: number};
};

const PDFViewerComponent = ({ fileUrl, page }: Props) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
      console.log("page", page.page);
        if (page.page > 0) {
            // Use setTimeout to ensure the PDF is loaded before navigating
            const timer = setTimeout(() => {
                // Try to find the page element by its data attribute
                const pageElement = document.querySelector(`[data-testid="core__page-layer-${page.page - 1}"]`) as HTMLElement;
                if (pageElement) {
                    // Scroll to the specific page
                    pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [page]);

    return (
        <div className="flex-1 h-full bg-white rounded-lg shadow-soft overflow-hidden">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    defaultScale={1.5}
                />
            </Worker>
        </div>
    );
};

export default PDFViewerComponent;

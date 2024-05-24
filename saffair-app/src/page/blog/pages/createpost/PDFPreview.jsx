import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getDownloadURL, ref } from 'firebase/storage';
import { gestorage } from '../../../../firebase'; // Adjust the import path
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set the workerSrc to the path provided by pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFPreview = ({ pdfPath }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const url = await getDownloadURL(ref(gestorage, pdfPath));
        setPdfUrl(url);
        setError(null);
      } catch (error) {
        console.error('Error while fetching document:', error);
        setError('Failed to load PDF. Please try again.');
      }
    };

    fetchPdfUrl();
  }, [pdfPath]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
  };

  return (
    <div className="w-full h-72 object-cover">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={setError}
          >
            <Page pageNumber={1} width={600} />
          </Document>
        )
      )}
    </div>
  );
};

export default PDFPreview;

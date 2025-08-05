import { useEffect, useRef } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { AppVersion } from '../types';

interface PreviewWindowProps {
  currentApp: AppVersion | null;
}

export default function PreviewWindow({ currentApp }: PreviewWindowProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (currentApp && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Preview</title>
              <style>
                  ${currentApp.css_content || ''}
                  body { margin: 0; padding: 0; }
              </style>
          </head>
          <body>
              ${currentApp.html_content || '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: #6b7280; font-family: system-ui, sans-serif;">No app generated yet. Start chatting to create your app!</div>'}
              <script>
                  ${currentApp.js_content || ''}
              </script>
          </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [currentApp]);

  const refreshPreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        </div>
        <button
          onClick={refreshPreview}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          title="Refresh preview"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-gray-50 relative">
        {!currentApp ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Eye size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start chatting with the AI to generate your first app. The preview will appear here once your app is created.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full relative">
            {/* Device Frame */}
            <div className="absolute inset-4 bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="App Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
            
            {/* Responsive Controls */}
            <div className="absolute top-6 left-6 flex space-x-2">
              <button
                className="px-3 py-1 text-xs bg-gray-800 text-white rounded-md hover:bg-gray-700"
                onClick={() => {
                  const iframe = iframeRef.current;
                  if (iframe) {
                    iframe.style.width = '375px';
                    iframe.style.height = '667px';
                  }
                }}
              >
                Mobile
              </button>
              <button
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-500"
                onClick={() => {
                  const iframe = iframeRef.current;
                  if (iframe) {
                    iframe.style.width = '768px';
                    iframe.style.height = '1024px';
                  }
                }}
              >
                Tablet
              </button>
              <button
                className="px-3 py-1 text-xs bg-gray-400 text-white rounded-md hover:bg-gray-300"
                onClick={() => {
                  const iframe = iframeRef.current;
                  if (iframe) {
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                  }
                }}
              >
                Desktop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
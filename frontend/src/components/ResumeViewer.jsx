import React from "react";
import { Dialog } from "@headlessui/react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { X } from "lucide-react"; // npm install lucide-react
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ResumeViewer({ isOpen, setIsOpen, url }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Centered Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Resume Preview
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* PDF Viewer Area */}
          <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800">
            {url ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            ) : (
              <p className="p-6 text-center text-gray-500 dark:text-gray-400">
                No resume uploaded for this candidate
              </p>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

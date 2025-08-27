import React, { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ResumeViewer({ isOpen, setIsOpen, url }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const origError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("Warning: getHexString")) return;
      origError(...args);
    };
    return () => { console.error = origError; };
  }, []);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[90vh] flex flex-col">
          <Dialog.Title className="text-lg font-bold p-3 border-b flex justify-between items-center">
            Resume Preview
            <button onClick={() => setIsOpen(false)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Close</button>
          </Dialog.Title>

          <div className="flex-1 overflow-hidden">
            {url ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            ) : (
              <p className="p-4 text-center text-gray-500">No resume uploaded for this candidate</p>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

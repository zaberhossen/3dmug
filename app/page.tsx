"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import ImageUploadCrop from "./components/ImageUploadCrop";

// Disable SSR for the 3D scene (Three.js requires browser APIs)
const MugScene = dynamic(() => import("./components/MugScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />
        <span className="text-sm">Loading 3D scene…</span>
      </div>
    </div>
  ),
});

export default function Home() {
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const downloadFnRef = useRef<(() => void) | null>(null);

  const handleDownloadReady = useCallback((fn: () => void) => {
    downloadFnRef.current = fn;
  }, []);

  const handleDownload = useCallback(() => {
    if (downloadFnRef.current) {
      downloadFnRef.current();
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            3D Mug Designer
          </h1>
          <p className="text-slate-400 text-base">
            Upload your photo · Crop &amp; adjust · Preview on a 3D mug ·
            Download mockup
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 3D Viewer — takes 3 of 5 columns on large screens */}
          <div className="lg:col-span-3 bg-slate-800/60 backdrop-blur border border-white/10 rounded-2xl overflow-hidden h-[500px] shadow-xl">
            <MugScene
              textureUrl={textureUrl}
              onDownloadReady={handleDownloadReady}
            />
          </div>

          {/* Controls panel — takes 2 of 5 columns */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <ImageUploadCrop onImageReady={setTextureUrl} />

            {/* Download button */}
            <button
              onClick={handleDownload}
              disabled={!textureUrl}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Mug Mockup
            </button>

            {/* Tips card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-400 space-y-1.5">
              <p className="text-slate-300 font-medium mb-2">How to use:</p>
              <p>① Upload a photo using the panel above</p>
              <p>② Adjust the crop area and aspect ratio</p>
              <p>③ Click &quot;Apply to Mug&quot; to preview in 3D</p>
              <p>④ Rotate the mug by dragging, zoom with scroll</p>
              <p>⑤ Download the mockup image when ready</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

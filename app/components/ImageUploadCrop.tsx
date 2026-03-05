"use client";

import { useState, useRef, useCallback, useId } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploadCropProps {
  onImageReady: (dataUrl: string) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get 2D canvas context. Ensure your browser supports canvas rendering.");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

const ASPECT_OPTIONS: { label: string; value: number | undefined }[] = [
  { label: "2:1", value: 2 / 1 },
  { label: "3:2", value: 3 / 2 },
  { label: "1:1", value: 1 },
  { label: "Free", value: undefined },
];

export default function ImageUploadCrop({ onImageReady }: ImageUploadCropProps) {
  const inputId = useId();
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(2 / 1);
  const [applied, setApplied] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      setCompletedCrop(undefined);
      setApplied(false);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() ?? "");
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (aspect) {
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current && newAspect) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspect));
    }
  };

  const applyToMug = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;
    canvasPreview(imgRef.current, canvasRef.current, completedCrop);
    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.92);
    onImageReady(dataUrl);
    setApplied(true);
  }, [completedCrop, onImageReady]);

  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-white flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Upload &amp; Crop Image</h2>

      {/* Upload area */}
      <label
        htmlFor={inputId}
        className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-white/5 transition-colors"
      >
        <svg
          className="w-6 h-6 mb-1 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm text-slate-300">
          {imgSrc ? "Change image" : "Click to upload image"}
        </span>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="hidden"
        />
      </label>

      {imgSrc && (
        <>
          {/* Aspect ratio controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-300 shrink-0">
              Aspect ratio:
            </span>
            {ASPECT_OPTIONS.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => handleAspectChange(value)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  aspect === value
                    ? "bg-emerald-500 text-white"
                    : "bg-white/20 hover:bg-white/30 text-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Crop editor */}
          <div className="max-h-64 overflow-auto rounded-xl bg-black/30">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={10}
              minHeight={10}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                alt="Crop preview"
                src={imgSrc}
                style={{ maxWidth: "100%", display: "block" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>

          <button
            onClick={applyToMug}
            disabled={!completedCrop}
            className={`w-full py-2.5 px-4 font-medium rounded-xl transition-all ${
              applied
                ? "bg-emerald-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white"
            }`}
          >
            {applied ? "✓ Applied to Mug" : "Apply to Mug"}
          </button>
        </>
      )}

      {!imgSrc && (
        <p className="text-sm text-slate-400 text-center py-2">
          Upload an image to place it on the mug
        </p>
      )}

      {/* Hidden canvas used for crop processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

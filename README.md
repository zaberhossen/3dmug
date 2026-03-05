# 3D Mug Designer

A Next.js application for placing a custom photo on a 3D rotating mug for print preview and mockup download.

## Features

- **360° rotating 3D mug** — Drag to rotate, scroll to zoom
- **Image upload & crop** — Upload any image and crop it with aspect-ratio presets (2:1, 3:2, 1:1, or free)
- **Live 3D preview** — See the cropped image texture-mapped onto the mug in real time
- **Download mockup** — Save the current mug view as a PNG image

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript, Tailwind CSS)
- [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) and [@react-three/drei](https://github.com/pmndrs/drei)
- [react-image-crop](https://github.com/DominicTobias/react-image-crop)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click **Upload Image** to select a photo from your device
2. Adjust the crop area and choose an aspect ratio
3. Click **Apply to Mug** to apply the texture to the 3D mug
4. Drag the mug to rotate and inspect it from any angle
5. Click **Download Mug Mockup** to save the current view as a PNG

## Deploy on Vercel

The easiest way to deploy this app is via [Vercel](https://vercel.com/new).


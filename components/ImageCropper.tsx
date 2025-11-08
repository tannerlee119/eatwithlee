'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  initialCrop?: { x: number; y: number; zoom: number };
  onCropComplete: (cropData: { x: number; y: number; zoom: number }) => void;
  onCancel: () => void;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageCropper({ imageUrl, initialCrop, onCropComplete, onCancel }: ImageCropperProps) {
  // Initialize with default center position
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialCrop?.zoom || 1);
  const [croppedAreaPercent, setCroppedAreaPercent] = useState<Area | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback(
    (croppedArea: Area, croppedAreaPx: Area) => {
      setCroppedAreaPercent(croppedArea);
      setCroppedAreaPixels(croppedAreaPx);
    },
    []
  );

  const saveCropData = () => {
    // For background-position to work correctly with zoom, we need to calculate
    // the position of the crop area relative to the zoomed image
    if (croppedAreaPercent) {
      // The croppedAreaPercent gives us where the 4:3 crop window sits on the original image
      // For CSS background-position:
      // - At zoom 1, background-size is 100% and we want to shift the image
      // - At zoom > 1, background-size increases and we need to reposition

      // Calculate the center of the cropped area
      const centerX = croppedAreaPercent.x + croppedAreaPercent.width / 2;
      const centerY = croppedAreaPercent.y + croppedAreaPercent.height / 2;

      // For background-position with zoom, we need to invert the logic
      // because we're positioning the image, not the crop window
      const bgPosX = centerX;
      const bgPosY = centerY;

      const cropData = { x: bgPosX, y: bgPosY, zoom };
      console.log('ImageCropper - croppedArea:', croppedAreaPercent, 'cropData:', cropData);
      onCropComplete(cropData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crop Cover Image</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cropper */}
        <div className="relative h-[500px] bg-gray-900">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteInternal}
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveCropData}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  console.log('ImageCropper initialCrop:', initialCrop);
  // Initialize with default center position
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialCrop?.zoom || 1);
  const [croppedAreaPercent, setCroppedAreaPercent] = useState<Area | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    // Save the cropped area percentages and zoom
    // croppedAreaPercent gives us the position of the crop window as percentages
    // which we can use directly for CSS background-position
    console.log('Cropped area percent:', croppedAreaPercent);
    console.log('Zoom:', zoom);
    if (croppedAreaPercent) {
      // Convert the crop area to center position for background-position
      // background-position expects the center point, not top-left corner
      const centerX = croppedAreaPercent.x + croppedAreaPercent.width / 2;
      const centerY = croppedAreaPercent.y + croppedAreaPercent.height / 2;
      const cropData = { x: centerX, y: centerY, zoom };
      console.log('Sending crop data:', cropData);
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
            aspect={16 / 9}
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
              disabled={isProcessing}
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

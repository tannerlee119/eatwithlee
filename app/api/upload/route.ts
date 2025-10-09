import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Convert buffer to base64 for Cloudinary
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload to Cloudinary with high quality settings
      const result = await cloudinary.uploader.upload(base64, {
        folder: 'eat-with-lee',
        resource_type: 'auto',
        quality: 'auto:best',       // Best quality auto-optimization
        fetch_format: 'auto',       // Auto-select best format (WebP, AVIF, etc.)
        flags: 'preserve_transparency', // Preserve image transparency
      });

      uploadedUrls.push(result.secure_url);
    }

    return NextResponse.json({
      urls: uploadedUrls,
      message: `Successfully uploaded ${uploadedUrls.length} file(s)`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

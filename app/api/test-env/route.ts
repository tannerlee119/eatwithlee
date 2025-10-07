import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasSecret: !!process.env.UPLOADTHING_SECRET,
    hasAppId: !!process.env.UPLOADTHING_APP_ID,
    secretPrefix: process.env.UPLOADTHING_SECRET?.substring(0, 10),
    appId: process.env.UPLOADTHING_APP_ID,
  });
}

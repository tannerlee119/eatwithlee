import { NextRequest, NextResponse } from 'next/server';
import { setFeaturedReview } from '@/lib/db-reviews';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = String(body?.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await setFeaturedReview(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error setting featured review:', error);
    return NextResponse.json({ error: 'Failed to set featured review' }, { status: 500 });
  }
}



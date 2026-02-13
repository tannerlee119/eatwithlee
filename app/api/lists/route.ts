import { NextResponse } from 'next/server';
import { getAllLists, createList } from '@/lib/db-lists';

export async function GET() {
    try {
        const lists = await getAllLists();
        return NextResponse.json(lists);
    } catch (error) {
        console.error('Failed to fetch lists:', error);
        return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, slug, description, isDraft, coverImage } = body;

        if (!title || !slug) {
            return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
        }

        const list = await createList({ title, slug, description, isDraft, coverImage });
        return NextResponse.json(list, { status: 201 });
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return NextResponse.json({ error: 'A list with that slug already exists' }, { status: 409 });
        }
        console.error('Failed to create list:', error);
        return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
    }
}

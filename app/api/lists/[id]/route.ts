import { NextRequest, NextResponse } from 'next/server';
import { getAllLists, updateList, deleteList } from '@/lib/db-lists';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const lists = await getAllLists();
        const list = lists.find((l) => l.id === id || l.slug === id);

        if (!list) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        return NextResponse.json(list);
    } catch (error) {
        console.error('Failed to fetch list:', error);
        return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, slug, description, isDraft, coverImage, publishedAt } = body;
        const list = await updateList(id, { title, slug, description, isDraft, coverImage, publishedAt });
        return NextResponse.json(list);
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }
        if (error?.code === 'P2002') {
            return NextResponse.json({ error: 'A list with that slug already exists' }, { status: 409 });
        }
        console.error('Failed to update list:', error);
        return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteList(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }
        console.error('Failed to delete list:', error);
        return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
    }
}

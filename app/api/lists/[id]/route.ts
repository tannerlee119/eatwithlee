import { NextResponse } from 'next/server';
import { getListBySlug, updateList, deleteList } from '@/lib/db-lists';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Try to find by ID first, then by slug
        const list = await prisma.list.findFirst({
            where: {
                OR: [{ id: params.id }, { slug: params.id }],
            },
        });

        if (!list) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        const fullList = await getListBySlug(list.slug);
        return NextResponse.json(fullList);
    } catch (error) {
        console.error('Failed to fetch list:', error);
        return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { title, slug, description, isDraft, coverImage } = body;
        const list = await updateList(params.id, { title, slug, description, isDraft, coverImage });
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
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await deleteList(params.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }
        console.error('Failed to delete list:', error);
        return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
    }
}

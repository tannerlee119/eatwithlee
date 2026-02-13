import { NextResponse } from 'next/server';
import { addListItem, updateListItem, removeListItem, reorderListItems } from '@/lib/db-lists';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        // Handle reorder
        if (body.action === 'reorder' && Array.isArray(body.orderedItemIds)) {
            await reorderListItems(params.id, body.orderedItemIds);
            return NextResponse.json({ success: true });
        }

        // Add item
        const { reviewId, blurb } = body;
        if (!reviewId) {
            return NextResponse.json({ error: 'reviewId is required' }, { status: 400 });
        }

        await addListItem(params.id, reviewId, blurb);
        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Failed to add list item:', error);
        return NextResponse.json({ error: 'Failed to add list item' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { itemId, blurb, position } = body;

        if (!itemId) {
            return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
        }

        await updateListItem(itemId, { blurb, position });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update list item:', error);
        return NextResponse.json({ error: 'Failed to update list item' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('itemId');

        if (!itemId) {
            return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
        }

        await removeListItem(itemId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to remove list item:', error);
        return NextResponse.json({ error: 'Failed to remove list item' }, { status: 500 });
    }
}

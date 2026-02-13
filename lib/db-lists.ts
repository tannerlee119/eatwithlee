import { prisma } from './prisma';

export interface ListWithItems {
    id: string;
    title: string;
    slug: string;
    description: string;
    isDraft: boolean;
    coverImage: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    items: ListItemWithReview[];
}

export interface ListItemWithReview {
    id: string;
    listId: string;
    reviewId: string;
    blurb: string;
    position: number;
    review: {
        id: string;
        restaurantName: string;
        slug: string;
        excerpt: string;
        coverImage: string;
        images: string;
        rating: number;
        priceRange: number;
        locationTag: string;
        address: string;
        lat: number;
        lng: number;
        venueType: string;
    };
}

function dbToList(dbList: any): ListWithItems {
    return {
        id: dbList.id,
        title: dbList.title,
        slug: dbList.slug,
        description: dbList.description || '',
        isDraft: dbList.isDraft,
        coverImage: dbList.coverImage || '',
        publishedAt: dbList.publishedAt.toISOString(),
        createdAt: dbList.createdAt.toISOString(),
        updatedAt: dbList.updatedAt.toISOString(),
        items: (dbList.items || [])
            .sort((a: any, b: any) => a.position - b.position)
            .map((item: any) => ({
                id: item.id,
                listId: item.listId,
                reviewId: item.reviewId,
                blurb: item.blurb || '',
                position: item.position,
                review: {
                    id: item.review.id,
                    restaurantName: item.review.restaurantName,
                    slug: item.review.slug,
                    excerpt: item.review.excerpt,
                    coverImage: item.review.coverImage,
                    images: item.review.images,
                    rating: item.review.rating,
                    priceRange: item.review.priceRange,
                    locationTag: item.review.locationTag || '',
                    address: item.review.address,
                    lat: item.review.lat,
                    lng: item.review.lng,
                    venueType: item.review.venueType || 'restaurant',
                },
            })),
    };
}

const listInclude = {
    items: {
        include: {
            review: {
                select: {
                    id: true,
                    restaurantName: true,
                    slug: true,
                    excerpt: true,
                    coverImage: true,
                    images: true,
                    rating: true,
                    priceRange: true,
                    locationTag: true,
                    address: true,
                    lat: true,
                    lng: true,
                    venueType: true,
                },
            },
        },
        orderBy: { position: 'asc' as const },
    },
};

export async function getAllLists(): Promise<ListWithItems[]> {
    const lists = await prisma.list.findMany({
        orderBy: { publishedAt: 'desc' },
        include: listInclude,
    });
    return lists.map(dbToList);
}

export async function getListBySlug(slug: string): Promise<ListWithItems | null> {
    const list = await prisma.list.findUnique({
        where: { slug },
        include: listInclude,
    });
    return list ? dbToList(list) : null;
}

export async function createList(data: {
    title: string;
    slug: string;
    description?: string;
    isDraft?: boolean;
    coverImage?: string;
    publishedAt?: string;
}): Promise<ListWithItems> {
    const list = await prisma.list.create({
        data: {
            title: data.title,
            slug: data.slug,
            description: data.description || '',
            isDraft: data.isDraft !== undefined ? data.isDraft : true,
            coverImage: data.coverImage || '',
            ...(data.publishedAt ? { publishedAt: new Date(data.publishedAt) } : {}),
        },
        include: listInclude,
    });
    return dbToList(list);
}

export async function updateList(
    id: string,
    data: {
        title?: string;
        slug?: string;
        description?: string;
        isDraft?: boolean;
        coverImage?: string;
        publishedAt?: string;
    }
): Promise<ListWithItems> {
    const updateData: any = { ...data };
    if (data.publishedAt) {
        updateData.publishedAt = new Date(data.publishedAt);
    }
    const list = await prisma.list.update({
        where: { id },
        data: updateData,
        include: listInclude,
    });
    return dbToList(list);
}

export async function deleteList(id: string): Promise<void> {
    await prisma.list.delete({ where: { id } });
}

export async function addListItem(
    listId: string,
    reviewId: string,
    blurb?: string
): Promise<void> {
    // Get the max position
    const maxItem = await prisma.listItem.findFirst({
        where: { listId },
        orderBy: { position: 'desc' },
    });
    const position = (maxItem?.position ?? -1) + 1;

    await prisma.listItem.create({
        data: { listId, reviewId, blurb: blurb || '', position },
    });
}

export async function updateListItem(
    id: string,
    data: { blurb?: string; position?: number }
): Promise<void> {
    await prisma.listItem.update({
        where: { id },
        data,
    });
}

export async function removeListItem(id: string): Promise<void> {
    await prisma.listItem.delete({ where: { id } });
}

export async function reorderListItems(
    listId: string,
    orderedItemIds: string[]
): Promise<void> {
    await prisma.$transaction(
        orderedItemIds.map((id, index) =>
            prisma.listItem.update({
                where: { id },
                data: { position: index },
            })
        )
    );
}

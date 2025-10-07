-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "coverImage" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "cuisines" TEXT NOT NULL,
    "vibes" TEXT NOT NULL,
    "foodTypes" TEXT NOT NULL,
    "favoriteDishes" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Lee',
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_slug_key" ON "Review"("slug");

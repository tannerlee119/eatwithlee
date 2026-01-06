-- Add isFeatured flag for selecting a featured review on /reviews
ALTER TABLE "Review" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;



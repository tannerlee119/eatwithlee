# Eat with Lee - Feature Roadmap

## 📋 Upcoming Features: Drafts + Image Captions

### **Phase 1: Database Setup - Drafts** ✅
- [x] Add `isDraft` boolean field to Prisma schema (default: false)
- [x] Update TypeScript `Review` interface to include `isDraft`
- [x] Run database migration for isDraft
- [x] Update database helper functions to handle `isDraft`

### **Phase 2: Database Setup - Image Captions** ✅
- [x] Change `images` field structure to support captions (array of `{url, caption}` objects)
- [x] Update Prisma schema to store image captions as JSON (no change needed - already JSON)
- [x] Update TypeScript types for images with captions
- [x] Update database helper functions to handle image captions with backward compatibility

### **Phase 3: Admin Form - Drafts** ✅
- [x] Add "Save as Draft" button next to "Publish Review" button
- [x] Update form submission handler to set `isDraft` based on button clicked
- [x] Show draft status indicator when editing a draft
- [x] Relax validation for drafts (coordinates and images not required)
- [x] Update API routes to handle `isDraft` field

### **Phase 4: Admin Form - Image Captions** ✅
- [x] Add caption input field for each uploaded image
- [x] Allow editing captions in the image preview grid
- [x] Store caption along with image URL
- [x] Captions are optional and can be added/edited anytime

### **Phase 5: Admin Dashboard - Tabs** ✅
- [x] Create tabs component (Published / Drafts)
- [x] Filter reviews by `isDraft` status based on active tab
- [x] Add visual badge/indicator for draft reviews in table
- [x] Show draft count on Drafts tab

### **Phase 6: Public View** ✅
- [x] Update home page to only show published reviews (`isDraft = false`)
- [x] Update ImageCarousel to display captions below images
- [x] Style captions nicely (italic, smaller text, centered)
- [x] Ensure draft reviews are not accessible via direct URL on public pages

### **Phase 7: Review Card Enhancements** ✅
- [x] Display tags on review cards (currently only shown on individual review pages)
- [x] Show 2-3 top tags from cuisines, vibes, or foodTypes on cards
- [x] Style tags to match existing tag design (rounded pills with colors)
- [x] Ensure tags don't clutter the card design (limit to 3 tags max)

### **Phase 8: Tag Accessibility & Readability** ✅
- [x] Fix low contrast on tag hover states (especially vibes tags)
- [x] Ensure text remains readable when hovering over tags
- [x] Improve color contrast ratios to meet accessibility standards
- [x] Test all tag types (cuisines, vibes, foodTypes) for readability

---

## Key Features Overview

### Draft System
- **Two-button workflow**: "Save as Draft" vs "Publish Review"
- **Private drafts**: Drafts hidden from public view
- **Tab navigation**: Switch between Published and Drafts on admin page
- **Draft badge**: Visual indicator on admin dashboard
- **Easy publishing**: Edit draft and click "Publish Review" to make it live

### Image Captions
- **Per-image captions**: Add descriptions to each photo
- **Caption examples**: "The signature wagyu burger", "Interior seating area", "Chef's special ramen"
- **Carousel display**: Show captions below images in the image carousel
- **Admin editing**: Easy-to-use caption input fields in admin form
- **Styled presentation**: Italicized, smaller text, centered below images

### Enhanced Review Cards
- **Visible tags**: Show cuisine/vibe/food type tags directly on home page cards
- **Quick context**: Users can see restaurant type at a glance (e.g., "Japanese", "Fine Dining", "Ramen")
- **Smart display**: Show most relevant 2-3 tags without cluttering the card
- **Consistent styling**: Match existing tag design with colored pill badges

---

## Technical Implementation Notes

### Database Schema Changes
```prisma
model Review {
  // ... existing fields
  isDraft        Boolean  @default(false)
  images         String   // JSON: [{ url: string, caption: string }]
}
```

### TypeScript Interface Updates
```typescript
export interface Review {
  // ... existing fields
  isDraft: boolean;
  images: Array<{ url: string; caption: string }>;
}
```

### Admin Form Buttons
```tsx
<button type="button" onClick={() => handleSave(true)}>
  Save as Draft
</button>
<button type="submit">
  Publish Review
</button>
```

---

## Implementation Order
1. **Review Card Tags** - Quick win, improves UX immediately (tags already exist, just need to display on cards)
2. **Draft System** - Simpler to implement, provides immediate value for workflow
3. **Image Captions** - Requires more UI changes but enhances content quality
4. **Test thoroughly** - Ensure drafts are private, captions display correctly, and tags look good
5. **Deploy incrementally** - Can deploy each feature independently

---

---

## ✅ Completed Features

### Draft System (Phases 1, 3, 5, 6) ✅ COMPLETE
- ✅ Database schema with `isDraft` field
- ✅ Admin form with "Save as Draft" and "Publish Review" buttons
- ✅ Relaxed validation for drafts (no coordinates/images required)
- ✅ Admin dashboard tabs for Published/Drafts filtering
- ✅ Draft badge indicators in admin table
- ✅ Home page filters out draft reviews from public view
- ✅ Draft status indicator when editing existing drafts
- ✅ Block direct URL access to draft reviews (404 page)

### Review Card Enhancements (Phase 7)
- ✅ Display tags on review cards (cuisines + vibes)
- ✅ Styled with colored pill badges matching design system

### Tag Accessibility (Phase 8) ✅ COMPLETE
- ✅ Improved contrast on all tag hover states
- ✅ Readable text colors for all tag types

### Image Captions (Phases 2, 4, 6) ✅ COMPLETE
- ✅ TypeScript types updated with `ImageWithCaption` interface
- ✅ Database helpers with backward compatibility (old string arrays → new objects)
- ✅ Admin form with optional caption inputs for each image
- ✅ Captions can be added/edited anytime (not required)
- ✅ ImageCarousel displays captions below images
- ✅ Styled captions (italic, centered, subtle background)

---

*Last updated: October 13, 2025*

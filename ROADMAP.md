# Eat with Lee - Feature Roadmap

## 📋 Upcoming Features: Drafts + Image Captions

### **Phase 1: Database Setup - Drafts**
- [ ] Add `isDraft` boolean field to Prisma schema (default: false)
- [ ] Update TypeScript `Review` interface to include `isDraft`
- [ ] Run database migration for isDraft
- [ ] Update database helper functions to handle `isDraft`

### **Phase 2: Database Setup - Image Captions**
- [ ] Change `images` field structure to support captions (array of `{url, caption}` objects)
- [ ] Update Prisma schema to store image captions as JSON
- [ ] Update TypeScript types for images with captions
- [ ] Update database helper functions to handle image captions

### **Phase 3: Admin Form - Drafts**
- [ ] Add "Save as Draft" button next to "Publish Review" button
- [ ] Update form submission handler to set `isDraft` based on button clicked
- [ ] Show draft status indicator when editing a draft

### **Phase 4: Admin Form - Image Captions**
- [ ] Add caption input field for each uploaded image
- [ ] Allow editing captions in the image preview grid
- [ ] Store caption along with image URL

### **Phase 5: Admin Dashboard - Tabs**
- [ ] Create tabs component (Published / Drafts)
- [ ] Filter reviews by `isDraft` status based on active tab
- [ ] Add visual badge/indicator for draft reviews in table
- [ ] Show draft count on Drafts tab

### **Phase 6: Public View**
- [ ] Update home page to only show published reviews (`isDraft = false`)
- [ ] Update ImageCarousel to display captions below images
- [ ] Style captions nicely (italic, smaller text, centered)
- [ ] Ensure draft reviews are not accessible via direct URL on public pages

### **Phase 7: Review Card Enhancements**
- [ ] Display tags on review cards (currently only shown on individual review pages)
- [ ] Show 2-3 top tags from cuisines, vibes, or foodTypes on cards
- [ ] Style tags to match existing tag design (rounded pills with colors)
- [ ] Ensure tags don't clutter the card design (limit to 3 tags max)

### **Phase 8: Tag Accessibility & Readability**
- [ ] Fix low contrast on tag hover states (especially vibes tags)
- [ ] Ensure text remains readable when hovering over tags
- [ ] Improve color contrast ratios to meet accessibility standards
- [ ] Test all tag types (cuisines, vibes, foodTypes) for readability

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

*Last updated: October 11, 2025*

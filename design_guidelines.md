# Donar Foof Fast Food Website - Design Guidelines

## Design Approach
**Reference-Based Approach** inspired by modern food delivery platforms (UberEats, DoorDash, Swiggy) with bold, appetite-appealing aesthetics. The design emphasizes vibrant food photography, quick decision-making, and seamless ordering flow.

## Core Design Elements

### A. Color Palette

**Primary Brand Colors:**
- **Spicy Red**: 0 85% 50% (primary CTA, branding, active states)
- **Deep Charcoal**: 0 0% 15% (text, headers, footer)
- **Warm Cream**: 40 60% 96% (background, cards)

**Supporting Colors:**
- **Soft Gray**: 0 0% 45% (secondary text, borders)
- **Success Green**: 142 70% 45% (order confirmations)
- **Dark Overlay**: 0 0% 0% with 40-60% opacity (image overlays)

**Dark Mode (Admin Panel):**
- Background: 0 0% 10%
- Surface: 0 0% 15%
- Accent: 0 85% 55%

### B. Typography

**Font Families:**
- Primary: 'Inter' (headings, UI elements) - Google Fonts
- Secondary: 'Poppins' (body text, descriptions) - Google Fonts
- Numbers/Prices: 'JetBrains Mono' (menu pricing)

**Typography Scale:**
- Hero Headlines: text-5xl md:text-7xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-semibold
- Product Names: text-xl font-medium
- Body Text: text-base leading-relaxed
- Prices: text-2xl font-mono font-bold
- Micro Copy: text-sm text-gray-500

### C. Layout System

**Spacing Primitives:** Tailwind units 4, 8, 12, 16, 24 (p-4, gap-8, mb-12, py-16, mt-24)

**Container Strategy:**
- Full-width hero: w-full with max-w-7xl inner content
- Content sections: max-w-6xl mx-auto px-4
- Menu grid: max-w-7xl with responsive columns

**Grid Systems:**
- Menu cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Features: grid-cols-1 md:grid-cols-3
- Gallery: grid-cols-2 md:grid-cols-3

### D. Component Library

**Navigation:**
- Sticky header with transparent-to-solid transition on scroll
- Logo left, menu center, cart icon right with badge count
- Mobile: hamburger menu with full-screen overlay
- Cart slideout from right side

**Product Cards:**
- Elevated white cards with subtle shadow (shadow-lg hover:shadow-xl)
- 4:3 aspect ratio food images with rounded-t-xl
- Product name, price, "Add to Cart" button
- Hover: lift animation (transform translate-y-[-4px])

**Buttons:**
- Primary: Red fill with white text, rounded-full, px-8 py-3
- Secondary: Outline with red border, transparent bg
- Icon buttons: Circular, 48x48px touch target
- Cart button: Red badge with white count overlay

**Shopping Cart:**
- Slideout panel 400px wide on desktop, full-width mobile
- Item rows with thumbnail, name, quantity controls, price
- Sticky footer with total and "Place Order" CTA
- Empty state illustration

**Forms:**
- Input fields: border-2 rounded-lg, focus:ring-2 focus:border-red-500
- Labels: text-sm font-medium mb-2
- Validation: Green checkmark or red error text
- Submit buttons: Full-width on mobile, auto on desktop

**Admin Dashboard:**
- Sidebar navigation (fixed left, 250px wide)
- Data tables with alternating row colors
- Modal overlays for add/edit operations
- Image upload with drag-drop zone and preview

### E. Images

**Hero Section:**
- Full-width hero (h-[70vh]) with diagonal split layout
- Left: Donar Foof branding, tagline, CTA button
- Right: Large hero image collage of signature dishes (burger, lavash, shaverma) with subtle parallax effect
- Overlay: gradient from left (dark) to transparent

**Product Images:**
- High-quality food photography on white/neutral backgrounds
- Consistent styling: centered product, soft shadows
- 800x600px minimum resolution
- Lazy loading for performance

**About Section:**
- 2-3 cafe interior photos in masonry grid
- Images with rounded corners and hover zoom effect
- Staff/kitchen action shots for authenticity

**Contact Page:**
- Embedded Google Maps (h-96, rounded-lg)
- Cafe exterior photo as header

### F. Animations & Interactions

**Micro-interactions:**
- Add to cart: Button scale pulse + cart badge bounce
- Card hover: Subtle lift (4px) with shadow expansion
- Image loading: Shimmer placeholder effect
- Page transitions: Smooth fade-in for content sections

**Scroll Animations:**
- Menu category headers fade-in on scroll
- Staggered product card appearance (100ms delay each)
- Parallax effect on hero background (0.5x scroll speed)

**Cart Interactions:**
- Slide-in from right (300ms ease-out)
- Quantity buttons: haptic-style scale on click
- Remove item: Fade out and collapse (200ms)

**Critical Constraints:**
- Maximum 2 animation types per page section
- All animations under 400ms duration
- Respect prefers-reduced-motion

### G. Page-Specific Layouts

**Homepage:**
1. Hero with food collage and "Order Online" CTA
2. Featured categories (3-column grid with icons)
3. Popular items carousel (4 cards visible)
4. Why choose us (benefits with icons)
5. CTA section with delivery info
6. Footer with contact, hours, social links

**Menu Page:**
- Sticky category filter tabs
- 4-column responsive product grid
- Floating cart summary (bottom-right corner)

**About Page:**
- Story section (text + founder photo)
- Values grid (3 columns with icons)
- Interior gallery (masonry layout)

**Contact Page:**
- 2-column split: Map (60%) + Form (40%)
- Contact info cards (phone, email, hours)

**Admin Panel:**
- Dark sidebar with menu icons
- Content area with data table
- Modal forms for CRUD operations
- Order timeline view with status badges

This design creates an appetizing, modern fast food experience that drives conversions while maintaining brand consistency across all touchpoints.
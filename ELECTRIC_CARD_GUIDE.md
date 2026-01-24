# Electric Card Components - Quick Reference

## Overview

Premium animated border card components inspired by React Bits, featuring stunning electric/neon border effects.

## Components

### 1. **ElectricCard** (Standard Animated Border)
The main component with a flowing animated gradient border.

```tsx
import { ElectricCard } from "@/components/ui/electric-card";

<ElectricCard className="p-8">
  <h3>Your Content</h3>
  <p>Your description</p>
</ElectricCard>
```

**Props:**
- `children`: ReactNode - Card content
- `className?`: string - Additional CSS classes for the inner card
- `borderColor?`: string - Tailwind gradient classes (default: `"from-cyan-500 via-blue-500 to-purple-500"`)
- `glowColor?`: string - Color name for glow effect (default: `"cyan"`)
- `animated?`: boolean - Enable/disable animation (default: `true`)

**Example with custom colors:**
```tsx
<ElectricCard 
  borderColor="from-green-500 via-emerald-500 to-cyan-500"
  glowColor="green"
  className="p-8"
>
  {/* Your content */}
</ElectricCard>
```

---

### 2. **ElectricCardCorners** (Corner Accents)
Features glowing corner accents that appear on hover.

```tsx
import { ElectricCardCorners } from "@/components/ui/electric-card";

<ElectricCardCorners className="p-8">
  <h3>Your Content</h3>
  <p>Your description</p>
</ElectricCardCorners>
```

**Props:**
- `children`: ReactNode - Card content
- `className?`: string - Additional CSS classes
- `accentColor?`: string - Accent color (default: `"cyan-500"`)

**Best for:**
- Subtle, elegant designs
- Professional dashboards
- Feature cards

---

### 3. **ElectricCardPulse** (Pulsing Border)
A pulsing border with breathing animation.

```tsx
import { ElectricCardPulse } from "@/components/ui/electric-card";

<ElectricCardPulse className="p-8">
  <h3>Your Content</h3>
  <p>Your description</p>
</ElectricCardPulse>
```

**Props:**
- `children`: ReactNode - Card content
- `className?`: string - Additional CSS classes
- `pulseColor?`: string - Pulse color (default: `"cyan"`)

**Best for:**
- Call-to-action cards
- Important notifications
- Attention-grabbing content

---

### 4. **ElectricCardRotate** (Rotating Gradient)
The most eye-catching variant with a slowly rotating gradient border.

```tsx
import { ElectricCardRotate } from "@/components/ui/electric-card";

<ElectricCardRotate className="p-8">
  <h3>Your Content</h3>
  <p>Your description</p>
</ElectricCardRotate>
```

**Props:**
- `children`: ReactNode - Card content
- `className?`: string - Additional CSS classes

**Best for:**
- Hero sections
- Premium features
- Pricing cards
- Showcase content

---

## Usage Examples

### Basic Card
```tsx
<ElectricCard className="p-8">
  <h3 className="text-xl font-bold text-white mb-4">Title</h3>
  <p className="text-white/70">Description text</p>
</ElectricCard>
```

### Feature Card
```tsx
<ElectricCardCorners className="p-8">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white">Feature Name</h3>
  </div>
  <p className="text-white/70">Feature description</p>
</ElectricCardCorners>
```

### Pricing Card
```tsx
<ElectricCardRotate className="p-8">
  <div className="text-center">
    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 mb-4">
      $99
    </div>
    <h3 className="text-xl font-bold text-white mb-2">Premium Plan</h3>
    <p className="text-white/70 mb-4">All features included</p>
    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold">
      Get Started
    </button>
  </div>
</ElectricCardRotate>
```

### Dashboard Stats Card
```tsx
<ElectricCardPulse className="p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-white/60 text-sm mb-1">Total Users</p>
      <p className="text-3xl font-bold text-white">12,345</p>
    </div>
    <div className="text-green-500 text-sm">
      +12.5%
    </div>
  </div>
</ElectricCardPulse>
```

---

## Styling Tips

### Custom Border Colors
Use Tailwind gradient classes:
```tsx
borderColor="from-green-500 via-emerald-500 to-cyan-500"
borderColor="from-orange-500 via-red-500 to-pink-500"
borderColor="from-purple-500 via-pink-500 to-red-500"
```

### Combining with Other Effects
```tsx
<ElectricCard className="p-8 hover:scale-105 transition-transform duration-300">
  {/* Content */}
</ElectricCard>
```

### Responsive Design
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  <ElectricCard className="p-6">Card 1</ElectricCard>
  <ElectricCard className="p-6">Card 2</ElectricCard>
  <ElectricCard className="p-6">Card 3</ElectricCard>
</div>
```

---

## Performance Notes

- All animations use CSS transforms and are GPU-accelerated
- Animations pause when the element is not visible (browser optimization)
- Minimal JavaScript overhead - pure CSS animations
- Optimized for 60fps performance

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

## Customization

### Disable Animation
```tsx
<ElectricCard animated={false} className="p-8">
  {/* Static border */}
</ElectricCard>
```

### Custom Animation Speed
Modify in `tailwind.config.ts`:
```ts
animation: {
  'electric-border': 'electric-border 5s linear infinite', // Slower
  'spin-slow': 'spin-slow 4s linear infinite', // Faster
}
```

---

## Integration with Existing Components

### With Buttons
```tsx
<ElectricCard className="p-8">
  <h3 className="text-xl font-bold text-white mb-4">Sign Up</h3>
  <Button className="w-full">Get Started</Button>
</ElectricCard>
```

### With Forms
```tsx
<ElectricCardPulse className="p-8">
  <form className="space-y-4">
    <Input placeholder="Email" />
    <Input type="password" placeholder="Password" />
    <Button type="submit" className="w-full">Submit</Button>
  </form>
</ElectricCardPulse>
```

### With Images
```tsx
<ElectricCardRotate className="overflow-hidden">
  <img src="/image.jpg" alt="..." className="w-full h-48 object-cover" />
  <div className="p-6">
    <h3 className="text-xl font-bold text-white">Title</h3>
    <p className="text-white/70">Description</p>
  </div>
</ElectricCardRotate>
```

---

## Demo Page

View all variants in action:
- Navigate to `/electric-card-examples` (if route is added)
- Or import and use `ElectricCardExamples` component

---

## Files Created

1. `src/components/ui/electric-card.tsx` - Main component file
2. `src/pages/ElectricCardExamples.tsx` - Demo/example page
3. `src/index.css` - Added animations
4. `tailwind.config.ts` - Added animation config

---

## Next Steps

1. Import the component where needed
2. Choose the variant that fits your design
3. Customize colors and content
4. Enjoy the premium electric border effect! ⚡

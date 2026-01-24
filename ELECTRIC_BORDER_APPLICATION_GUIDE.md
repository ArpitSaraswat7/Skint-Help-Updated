# Electric Border Application Guide

## How to Apply Electric Border to All Cards

This guide shows you exactly how to wrap every card in your project with the ElectricBorder component.

---

## Step 1: Import the Component

At the top of any file where you want to use electric borders:

```tsx
import ElectricBorder from '@/components/ui/ElectricBorder';
```

---

## Step 2: Wrap Your Cards

### Basic Pattern

**Before:**
```tsx
<div className="glass-card p-8">
  {/* Card content */}
</div>
```

**After:**
```tsx
<ElectricBorder color="#7df9ff" speed={0.8} chaos={0.1} borderRadius={16}>
  <div className="glass-card p-8">
    {/* Card content */}
  </div>
</ElectricBorder>
```

---

## Color Schemes by Portal/Theme

Use these colors to match your existing design:

```tsx
// Green/Emerald (Public Receiver, Success)
color="#10b981"

// Orange/Red (Restaurant)
color="#ff6b35"

// Cyan/Blue (Worker, Info)
color="#06b6d4"

// Purple/Pink (Admin/Owner)
color="#a855f7"

// Default Cyan
color="#7df9ff"
```

---

## Files to Update

### 1. **Portal Section** (`src/components/portal-section.tsx`)

**Location:** Line 93
**Current:** `<div className="depth-card p-6 h-full flex flex-col group">`

**Replace with:**
```tsx
function PortalCard({ icon, title, description, color, features, link }: PortalCardProps) {
  // Map colors
  const colorMap: Record<string, string> = {
    'from-orange-500 to-red-500': '#ff6b35',
    'from-green-500 to-emerald-500': '#10b981',
    'from-cyan-500 to-blue-500': '#06b6d4',
  };
  const electricColor = colorMap[color] || '#7df9ff';

  return (
    <ElectricBorder color={electricColor} speed={0.8} chaos={0.1} borderRadius={16}>
      <div className="depth-card p-6 h-full flex flex-col group">
        {/* Rest of content */}
      </div>
    </ElectricBorder>
  );
}
```

---

### 2. **Testimonials** (`src/components/testimonials-section.tsx`)

**Location:** Line 99
**Current:** `<div className="depth-card p-6 h-full relative group">`

**Replace with:**
```tsx
<ElectricBorder color="#10b981" speed={0.6} chaos={0.08} borderRadius={16}>
  <div className="depth-card p-6 h-full relative group">
    {/* Testimonial content */}
  </div>
</ElectricBorder>
```

---

### 3. **How It Works Cards** (`src/components/how-it-works.tsx`)

**Location:** Line 166
**Current:** `<div className="depth-card p-6 h-full relative group">`

**Replace with:**
```tsx
<ElectricBorder color="#06b6d4" speed={0.7} chaos={0.09} borderRadius={16}>
  <div className="depth-card p-6 h-full relative group">
    {/* Step content */}
  </div>
</ElectricBorder>
```

---

### 4. **Admin Dashboard** (`src/pages/AdminDashboard.tsx`)

**Stats Cards - Line 137:**
```tsx
<ElectricBorder color="#a855f7" speed={0.5} chaos={0.1} borderRadius={12}>
  <div className="depth-card p-6">
    {/* Stats content */}
  </div>
</ElectricBorder>
```

**Main Card - Line 157:**
```tsx
<ElectricBorder color="#7df9ff" speed={0.8} chaos={0.12} borderRadius={24}>
  <div className="glass-card p-8 rounded-3xl">
    {/* Dashboard content */}
  </div>
</ElectricBorder>
```

---

### 5. **Restaurant Dashboard** (`src/pages/RestaurantDashboard.tsx`)

**Main Card - Line 141:**
```tsx
<ElectricBorder color="#ff6b35" speed={0.8} chaos={0.11} borderRadius={24}>
  <div className="glass-card p-8 rounded-3xl mb-8">
    {/* Restaurant content */}
  </div>
</ElectricBorder>
```

**Stats Cards - Line 233:**
```tsx
<ElectricBorder color="#ff6b35" speed={0.6} chaos={0.1} borderRadius={12}>
  <div className="depth-card p-6">
    {/* Stats */}
  </div>
</ElectricBorder>
```

---

### 6. **Worker Dashboard** (`src/pages/WorkerDashboard.tsx`)

**Main Card - Line 137:**
```tsx
<ElectricBorder color="#06b6d4" speed={0.8} chaos={0.11} borderRadius={24}>
  <div className="glass-card p-8 rounded-3xl mb-8">
    {/* Worker content */}
  </div>
</ElectricBorder>
```

**Stats Cards - Line 171:**
```tsx
<ElectricBorder color="#06b6d4" speed={0.6} chaos={0.1} borderRadius={12}>
  <div className="depth-card p-6">
    {/* Stats */}
  </div>
</ElectricBorder>
```

---

### 7. **Contact Page** (`src/pages/Contact.tsx`)

**Form Card - Line 67:**
```tsx
<ElectricBorder color="#10b981" speed={0.9} chaos={0.12} borderRadius={24}>
  <div className="glass-card p-8 rounded-3xl">
    {/* Contact form */}
  </div>
</ElectricBorder>
```

**Info Cards - Line 151:**
```tsx
<ElectricBorder color="#06b6d4" speed={0.7} chaos={0.1} borderRadius={12}>
  <div className="depth-card p-6 flex items-start gap-4 group cursor-pointer block">
    {/* Contact info */}
  </div>
</ElectricBorder>
```

---

### 8. **Join Us Page** (`src/pages/JoinUs.tsx`)

**Form Card - Line 104:**
```tsx
<ElectricBorder color="#7df9ff" speed={0.9} chaos={0.12} borderRadius={24}>
  <div className="glass-card p-8 rounded-3xl">
    {/* Join form */}
  </div>
</ElectricBorder>
```

**Role Cards - Line 224:**
```tsx
<ElectricBorder color={isSelected ? "#10b981" : "#7df9ff"} speed={0.7} chaos={0.1} borderRadius={12}>
  <div className={`depth-card p-6 h-full text-left transition-all ${isSelected ? 'ring-2 ring-green-500 neon-glow' : ''}`}>
    {/* Role content */}
  </div>
</ElectricBorder>
```

---

### 9. **Impact Section** (`src/components/impact-section.tsx`)

Find all `depth-card` or `glass-card` and wrap with:
```tsx
<ElectricBorder color="#10b981" speed={0.6} chaos={0.09} borderRadius={16}>
  {/* Card content */}
</ElectricBorder>
```

---

### 10. **Map Section** (`src/components/map-section.tsx`)

**Main Map Card - Line 112:**
```tsx
<ElectricBorder color="#06b6d4" speed={0.8} chaos={0.11} borderRadius={16}>
  <div className="depth-card p-8 h-[500px] relative overflow-hidden">
    {/* Map */}
  </div>
</ElectricBorder>
```

**Location Cards - Line 252:**
```tsx
<ElectricBorder color="#7df9ff" speed={0.6} chaos={0.08} borderRadius={8}>
  <div className="depth-card p-4 group cursor-pointer">
    {/* Location info */}
  </div>
</ElectricBorder>
```

---

## Configuration Options

### Speed
- **Slow (0.5-0.6)**: Subtle, professional
- **Medium (0.7-0.9)**: Balanced, noticeable
- **Fast (1.0-1.5)**: Energetic, attention-grabbing

### Chaos
- **Low (0.05-0.08)**: Smooth, gentle waves
- **Medium (0.09-0.12)**: Balanced movement
- **High (0.13-0.20)**: Wild, electric effect

### Border Radius
- **Small cards**: 8-12px
- **Medium cards**: 16px
- **Large cards**: 24px

---

## Quick Replace Pattern

Use Find & Replace in your editor:

**Find:**
```
<div className="depth-card
```

**Replace with:**
```
<ElectricBorder color="#7df9ff" speed={0.8} chaos={0.1} borderRadius={16}>
<div className="depth-card
```

**Then add closing tag before the closing div:**
```
</div>
</ElectricBorder>
```

---

## Performance Tips

1. **Use lower chaos values** (0.08-0.10) for better performance
2. **Reduce speed** on pages with many cards
3. **Consider disabling** on mobile for battery life:

```tsx
const isMobile = window.innerWidth < 768;

<ElectricBorder 
  color="#7df9ff" 
  speed={isMobile ? 0 : 0.8}
  chaos={isMobile ? 0 : 0.1}
>
  {/* Content */}
</ElectricBorder>
```

---

## Complete Example

Here's a complete before/after for a portal card:

### Before:
```tsx
function PortalCard({ icon, title, description }: Props) {
  return (
    <div className="depth-card p-6 h-full">
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

### After:
```tsx
import ElectricBorder from '@/components/ui/ElectricBorder';

function PortalCard({ icon, title, description }: Props) {
  return (
    <ElectricBorder 
      color="#10b981" 
      speed={0.8} 
      chaos={0.1} 
      borderRadius={16}
      thickness={2}
    >
      <div className="depth-card p-6 h-full">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500">
          {icon}
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </ElectricBorder>
  );
}
```

---

## Summary Checklist

- [ ] Portal Section cards
- [ ] Testimonial cards
- [ ] How It Works cards
- [ ] Admin Dashboard cards
- [ ] Restaurant Dashboard cards
- [ ] Worker Dashboard cards
- [ ] Contact page cards
- [ ] Join Us page cards
- [ ] Impact section cards
- [ ] Map section cards
- [ ] Public Food Map cards
- [ ] Navbar elements (optional)
- [ ] Footer elements (optional)

---

## Need Help?

The ElectricBorder component is located at:
`src/components/ui/ElectricBorder.tsx`

All props are optional except `children`. Default values work great for most cases!

---

**Estimated Time:** 30-45 minutes to apply to all cards
**Impact:** Stunning, premium electric borders throughout your entire site! ⚡

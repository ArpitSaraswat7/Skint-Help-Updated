# FloatingLines Background Implementation Guide

## ✅ What Was Implemented

I've successfully added the **FloatingLines** animated background to your Skint Help application! Here's what was done:

### 1. **Installed Dependencies**
```bash
npm install three @types/three
```
- Added Three.js library for WebGL rendering
- Added TypeScript types for Three.js

### 2. **Created Components**

#### `src/components/ui/FloatingLines.tsx`
- Full WebGL shader-based animated background
- Features:
  - Animated floating wave lines
  - Interactive mouse effects (currently disabled for performance)
  - Parallax scrolling effect
  - Custom gradient colors matching your site theme
  - Smooth animations using Three.js

#### `src/components/GlobalBackground.tsx`
- Wrapper component that applies FloatingLines globally
- Configuration:
  - **6 lines** per wave layer
  - **3 wave layers**: top, middle, bottom
  - **Gradient colors**: Emerald → Teal → Cyan → Blue → Violet
  - **Animation speed**: 1.2x
  - **Parallax**: Enabled
  - **Interactive**: Disabled (for better performance)

### 3. **Integrated into App**

Modified `src/App.tsx`:
- Added `<GlobalBackground />` component
- Positioned it at the root level inside BrowserRouter
- Background appears on ALL pages automatically

### 4. **Updated Styles**

Modified `src/index.css`:
- Added z-index rules to ensure content appears above background
- All main elements (sections, headers, nav, footer) have `z-index: 1`
- Background has `z-index: 0`

## 🎨 Current Configuration

```tsx
<FloatingLines
  enabledWaves={["top", "middle", "bottom"]}
  lineCount={6}
  lineDistance={8}
  bendRadius={5}
  bendStrength={-0.5}
  interactive={false}  // Disabled for performance
  parallax={true}      // Moves with scroll
  animationSpeed={1.2}
  mixBlendMode="normal"
  linesGradient={[
    "#10b981", // emerald-500
    "#14b8a6", // teal-500
    "#06b6d4", // cyan-500
    "#3b82f6", // blue-500
    "#8b5cf6", // violet-500
  ]}
/>
```

## 🔧 How to Customize

### Change Colors
Edit `src/components/GlobalBackground.tsx` and modify the `linesGradient` array:
```tsx
linesGradient={[
  "#YOUR_COLOR_1",
  "#YOUR_COLOR_2",
  "#YOUR_COLOR_3",
  // Add up to 8 colors
]}
```

### Adjust Animation Speed
Change the `animationSpeed` prop:
```tsx
animationSpeed={0.5}  // Slower
animationSpeed={2.0}  // Faster
```

### Enable Mouse Interaction
Set `interactive` to `true`:
```tsx
interactive={true}
bendRadius={5}
bendStrength={-0.5}
```

### Change Number of Lines
Modify `lineCount`:
```tsx
lineCount={10}  // More lines
lineCount={3}   // Fewer lines
```

### Adjust Line Spacing
Modify `lineDistance`:
```tsx
lineDistance={15}  // More spacing
lineDistance={3}   // Less spacing
```

## 🌐 Viewing the Background

1. **Dev Server**: Running on `http://localhost:8081`
2. **Open your browser** and navigate to the URL
3. **You should see**:
   - Animated floating wave lines in the background
   - Gradient colors from emerald to violet
   - Smooth parallax effect when scrolling
   - Lines moving and animating continuously

## 🐛 Troubleshooting

### Background Not Visible?

1. **Check Browser Console** (F12):
   - Look for WebGL errors
   - Check if Three.js loaded properly

2. **Verify z-index**:
   - Background should be at `z-index: 0`
   - Content should be at `z-index: 1` or higher

3. **Check Browser Compatibility**:
   - Requires WebGL support
   - Works best in modern browsers (Chrome, Firefox, Edge)

4. **Increase Visibility**:
   - Try changing `mixBlendMode` to `"screen"` or `"lighten"`
   - Increase `lineCount` to make more visible lines
   - Adjust gradient colors to brighter values

### Performance Issues?

1. **Reduce line count**:
   ```tsx
   lineCount={3}
   ```

2. **Disable parallax**:
   ```tsx
   parallax={false}
   ```

3. **Slow down animation**:
   ```tsx
   animationSpeed={0.5}
   ```

## 📁 Files Modified

- ✅ `src/components/ui/FloatingLines.tsx` (NEW)
- ✅ `src/components/GlobalBackground.tsx` (NEW)
- ✅ `src/App.tsx` (MODIFIED)
- ✅ `src/index.css` (MODIFIED)
- ✅ `package.json` (MODIFIED - added three.js)

## 🎯 Next Steps

1. **Test the background** by opening http://localhost:8081
2. **Adjust colors** to match your exact brand colors
3. **Fine-tune animation** speed and line count
4. **Enable interactive mode** if you want mouse effects

The background is now live and should be visible across all pages of your application!

# 🌑 Dark Theme Quick Start

## 🚀 See It In Action

```bash
npm run dev
```

Open http://localhost:3000

---

## 🎨 What's New?

### 1. **Dark Theme** 🌙
- Deep black background (`#0a0a0a` → `#1a1a1a`)
- GSAP green accents (`#88c540`)
- High contrast for better readability
- Premium, modern aesthetic

### 2. **Horizontal Scrolling Cards** 🎞️
- Cards scroll left as you scroll down
- Inspired by [GSAP's horizontal gallery demo](https://demos.gsap.com/demo/horizontal-scrolling-gallery)
- Smooth, scroll-linked animation
- All 6 category cards in a row

### 3. **Green Accent Color** 💚
Everything uses GSAP's signature green:
- Buttons
- Borders
- Hover effects
- Particles
- Cursor
- Glow effects
- Badge

---

## 🎯 Quick Visual Guide

### Color Palette
```
Background:    #0a0a0a → #1a1a1a (Black gradient)
Primary:       #88c540 (GSAP Green)
Hover:         #7ab636 (Darker green)
Text:          #FFFFFF (White)
Secondary:     #9CA3AF (Gray)
Cards:         #1a1a1a (Dark gray)
```

### Key Components

#### Try Now Button
- **Color**: Bright GSAP green
- **Text**: Black (for contrast)
- **Glow**: Green shadow on hover

#### Cards
- **Background**: Dark with subtle transparency
- **Border**: Green with low opacity
- **Hover**: Brighter green border + glow
- **Still magnetic!** (3D tilt effect)

#### Header
- **Transparent** by default
- **Dark blur** when scrolled
- **Green sign-in button**

---

## 🎬 Animation Sequence

### Page Load
1. Header slides in
2. Green badge drops
3. Title fades up (white text)
4. Green button scales in
5. Cards slide from left with stagger

### On Scroll
1. Title parallaxes up
2. **Cards start scrolling left** ← NEW!
3. Grid shifts position
4. Scroll indicator fades

### On Hover
1. Cards tilt in 3D (magnetic effect)
2. Green glow appears
3. Border brightens
4. Icon scales up

---

## 🎯 Horizontal Scroll Details

### How It Works
- Scroll down → Cards move left
- Smooth, physics-based movement
- Reveals all 6 cards progressively
- Linked to scroll position (scrub: 1)

### When It Triggers
- Starts when cards reach 60% of viewport
- Continues as you scroll
- Ends when all cards are visible

### Card Layout
- **Horizontal flex** (not grid anymore)
- **Min width**: 280px mobile, 320px desktop
- **Doesn't wrap**: All cards in one row
- **Gap**: 24px between cards

---

## 💡 Pro Tips

### 1. **Move Mouse Over Cards**
The magnetic 3D tilt effect still works! Try it with the dark cards.

### 2. **Scroll Slowly**
Watch the cards smoothly slide left as you scroll down.

### 3. **Check the Glow**
Move your mouse around to see the green glow follow.

### 4. **Custom Cursor**
The cursor is now green! (desktop only)

### 5. **Grid Animation**
The background grid is green and pulses subtly.

---

## 🎨 Before vs After

### Before (Light Theme)
- White background
- Yellow accents (#FBBB00)
- Grid layout for cards
- Static card arrangement

### After (Dark Theme)
- Black background
- Green accents (#88c540)
- Horizontal scroll for cards
- Dynamic card movement on scroll

---

## 🔧 Quick Customizations

### Make Scroll Faster
In `HeroSection.tsx`, find:
```typescript
scrub: 1 // Change to 0.5 for faster
```

### Wider Cards
In `HeroSection.tsx`, find:
```typescript
min-w-[280px] md:min-w-[320px]
// Change to min-w-[320px] md:min-w-[400px]
```

### Different Green
Replace all instances of:
- `#88c540` with your color
- `#7ab636` with darker shade

---

## 🎭 Design Features

### GSAP-Inspired
- Based on [gsap.com](https://gsap.com/)
- Same green color (`#88c540`)
- Dark, sleek aesthetic
- Focus on animation

### Professional Polish
- High contrast
- Clear hierarchy
- Smooth animations
- Cohesive color scheme

### Interactive
- Magnetic cards
- 3D tilt effects
- Smooth scrolling
- Hover feedback

---

## 📱 Mobile Friendly

### Mobile Adaptations
- Cards can be swiped horizontally
- Touch-friendly interactions
- Simplified animations
- No custom cursor

### Desktop Features
- Custom green cursor
- Full glow effects
- Horizontal scroll animation
- All magnetic effects

---

## ✅ Check These Features

1. ✅ Dark background throughout
2. ✅ Green accents everywhere
3. ✅ Horizontal card scroll
4. ✅ Magnetic card hover (3D tilt)
5. ✅ Green glow following mouse
6. ✅ Green cursor (desktop)
7. ✅ Smooth entrance animations
8. ✅ Parallax title effect
9. ✅ Green particles floating
10. ✅ Pulsing green grid

---

## 🌟 The Result

Your landing page now has:
- **Premium dark theme** like GSAP
- **Horizontal scrolling cards** like modern galleries
- **Consistent green branding** throughout
- **All animations** still working
- **Professional aesthetic** that stands out

Perfect for a modern tech assistant product! 🎉

---

## 🆘 Troubleshooting

### Cards Not Scrolling?
- Make sure you're scrolling down (not just hovering)
- Scroll past the title section
- Cards should start moving when they reach 60% of viewport

### Colors Look Different?
- Check browser dev tools
- Verify CSS is loading
- Hard refresh (Cmd/Ctrl + Shift + R)

### Animations Jerky?
- Close other heavy tabs
- Check CPU usage
- Try in incognito mode

---

Enjoy your new dark theme with horizontal scrolling! 🚀✨


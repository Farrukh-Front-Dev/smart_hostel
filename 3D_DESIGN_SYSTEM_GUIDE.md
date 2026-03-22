# 3D Design System - Complete Guide

Complete design system documentation for creating modern, bold, and playful UI with 3D effects using Tailwind CSS. This guide includes design philosophy, core components, real-world examples, and quick reference.

---

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Quick Reference](#quick-reference)
3. [Core Components](#core-components)
4. [Real-World Examples](#real-world-examples)
5. [Color Palette](#color-palette)
6. [Best Practices](#best-practices)
7. [Tailwind Configuration](#tailwind-configuration)

---

## 🎨 Design Philosophy

This design system creates a **bold, playful, and modern** aesthetic using:
- **3D shadows** for depth and tactile feel
- **Thick borders** for definition and structure  
- **Rounded corners** for friendliness
- **Vibrant gradients** for energy and attention
- **Hover animations** for interactivity

---

## ⚡ Quick Reference

### Colors
```css
/* Primary Gradient */
bg-linear-to-br from-[#38C9E6] to-[#43E8A0]

/* Pink Accent */
bg-[#FF9B9B] hover:bg-[#FF8888]

/* Borders */
border-2 border-gray-900

/* Dark Mode */
bg-white dark:bg-dark-bg
text-gray-900 dark:text-white
```

### Shadows (3D Effect)
```css
shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  /* Small */
shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]  /* Medium */
shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  /* Large */
shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]  /* Extra Large */
```

### Border Radius
```css
rounded-lg    /* Small (8px) */
rounded-xl    /* Buttons/Inputs (12px) */
rounded-2xl   /* Medium Cards (16px) */
rounded-3xl   /* Large Cards (24px) */
```

### Hover Effects
```css
/* Card Hover (Press Down) */
hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all

/* Button Hover (Lift Up) */
hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all
```

### Common Patterns
```css
/* Card */
bg-white dark:bg-dark-bg rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]

/* Primary Button */
px-6 py-3 bg-linear-to-br from-[#38C9E6] to-[#43E8A0] text-white font-bold rounded-xl border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all

/* Input Field */
w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 transition-all

/* Badge */
inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border-2 border-gray-900 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400
```

---

## 📦 Core Components

### 1. Cards

**Base Card:**
```tsx
<div className="bg-white dark:bg-dark-bg rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
  {/* Content */}
</div>
```

**Interactive Card:**
```tsx
<div className="bg-white dark:bg-dark-bg rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
  {/* Content */}
</div>
```

### 2. Buttons

**Primary Button (Gradient):**
```tsx
<button className="px-6 py-3 bg-linear-to-br from-[#38C9E6] to-[#43E8A0] text-white font-bold rounded-xl border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
  Click Me
</button>
```

**Secondary Button (Pink):**
```tsx
<button className="px-6 py-3 bg-[#FF9B9B] hover:bg-[#FF8888] text-white font-bold rounded-xl border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
  Secondary
</button>
```

**Danger Button:**
```tsx
<button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
  Delete
</button>
```

**Ghost Button:**
```tsx
<button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl border-2 border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
  Cancel
</button>
```

**Button Sizes:**
- Small: `px-4 py-2 text-sm`
- Medium: `px-6 py-3 text-base`
- Large: `px-8 py-4 text-lg`

### 3. Input Fields

**Text Input:**
```tsx
<input
  type="text"
  className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 transition-all"
  placeholder="Enter text..."
/>
```

**Textarea:**
```tsx
<textarea
  rows={4}
  className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 transition-all resize-none"
  placeholder="Enter description..."
/>
```

**Select:**
```tsx
<select className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 transition-all appearance-none cursor-pointer">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### 4. Badges & Tags

**Status Badge:**
```tsx
<span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border-2 border-gray-900 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
  Active
</span>
```

**Color Variants:**
- Success: `bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400`
- Warning: `bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400`
- Error: `bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400`
- Info: `bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400`
- Neutral: `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400`

### 5. Icon Containers

**Small Icon Box:**
```tsx
<div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#38C9E6] to-[#43E8A0] flex items-center justify-center border-2 border-gray-900">
  <Icon className="w-5 h-5 text-white" />
</div>
```

**Large Icon Box:**
```tsx
<div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#38C9E6] to-[#43E8A0] flex items-center justify-center border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
  <Icon className="w-7 h-7 text-white" />
</div>
```

### 6. Tables

```tsx
<div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-900">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
            Header
          </th>
        </tr>
      </thead>
      <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-700">
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
            Data
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### 7. Modals

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 max-w-md w-full border-2 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Modal Title
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      Modal content goes here
    </p>
    <div className="flex gap-3">
      <button className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl border-2 border-gray-900">
        Cancel
      </button>
      <button className="flex-1 px-6 py-3 bg-linear-to-br from-[#38C9E6] to-[#43E8A0] text-white font-bold rounded-xl border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### 8. Alerts

**Success:**
```tsx
<div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-4">
  <p className="text-green-700 dark:text-green-400 font-semibold">Success message</p>
</div>
```

**Error:**
```tsx
<div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4">
  <p className="text-red-700 dark:text-red-400 font-semibold">Error message</p>
</div>
```

**Warning:**
```tsx
<div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4">
  <p className="text-yellow-700 dark:text-yellow-400 font-semibold">Warning message</p>
</div>
```

---

## 🌟 Real-World Examples

### Dashboard Action Card
```tsx
<div className="bg-white dark:bg-dark-bg rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
    Find Candidates
  </h3>
  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
    Browse through talented candidates and find the perfect match
  </p>
  <button className="w-full bg-linear-to-br from-[#38C9E6] to-[#43E8A0] text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
    View Candidates
    <ArrowRight className="w-5 h-5" />
  </button>
</div>
```

### Statistics Card
```tsx
<div className="bg-white dark:bg-dark-bg rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
  <div className="flex items-start justify-between mb-4">
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        Total Users
      </p>
      <p className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
        1,234
      </p>
    </div>
    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#38C9E6] to-[#43E8A0] flex items-center justify-center border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <Users className="w-7 h-7 text-white" />
    </div>
  </div>
  <div className="flex items-center gap-2 text-sm">
    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
    <span className="text-green-600 dark:text-green-400 font-semibold">
      +12% this month
    </span>
  </div>
</div>
```

### Filter Bar
```tsx
<div className="bg-white dark:bg-dark-surface rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Search */}
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 transition-all"
      />
    </div>

    {/* Category Filter */}
    <div className="relative">
      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <select className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 transition-all appearance-none cursor-pointer">
        <option>All Categories</option>
        <option>Technology</option>
      </select>
    </div>

    {/* Status Filter */}
    <div className="relative">
      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <select className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 transition-all appearance-none cursor-pointer">
        <option>All Status</option>
        <option>Active</option>
      </select>
    </div>
  </div>
</div>
```

### Empty State
```tsx
<div className="bg-white dark:bg-dark-surface border-2 border-gray-900 rounded-3xl p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
    No items found
  </h3>
  <p className="text-gray-600 dark:text-gray-400">
    Try adjusting your filters
  </p>
</div>
```

### Form Section
```tsx
<div className="bg-white dark:bg-dark-bg rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
    Basic Information
  </h2>
  
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Company Name
      </label>
      <input
        type="text"
        className="w-full px-4 py-3 border-2 border-gray-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-400 transition-all"
        placeholder="Enter company name"
      />
    </div>

    <div className="flex gap-4 pt-4">
      <button className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl border-2 border-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
        Cancel
      </button>
      <button className="flex-1 px-6 py-3 bg-linear-to-br from-[#38C9E6] to-[#43E8A0] text-white font-bold rounded-xl border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
        Save Changes
      </button>
    </div>
  </div>
</div>
```

---

## 🎨 Color Palette

### Primary Colors
```css
--cyan: #38C9E6
--green: #43E8A0
--pink: #FF9B9B
--pink-hover: #FF8888
--border: #000000 (gray-900)
```

### Gradient Combinations
```tsx
/* Primary */
bg-linear-to-br from-[#38C9E6] to-[#43E8A0]

/* Alternatives */
bg-linear-to-br from-blue-500 to-cyan-500
bg-linear-to-br from-purple-500 to-pink-500
bg-linear-to-br from-orange-500 to-red-500
bg-linear-to-br from-green-500 to-emerald-500
```

### Dark Mode
```css
--dark-bg: #1a1a1a
--dark-surface: #2d2d2d
--dark-border: #404040
```

---

## 📱 Responsive Design

### Grid Layouts
```tsx
/* 1-2-3-4 columns */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

/* 1-2-3 columns */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

/* 1-2 columns */
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

### Flex Layouts
```tsx
/* Stack on mobile, row on desktop */
<div className="flex flex-col lg:flex-row gap-6">
```

### Hide/Show
```tsx
/* Hide on mobile, show on desktop */
<div className="hidden lg:block">

/* Show on mobile, hide on desktop */
<div className="block lg:hidden">
```

---

## 🎯 Best Practices

### DO ✅
- Use consistent border thickness (`border-2`)
- Apply 3D shadows to interactive elements
- Use gradients for primary actions
- Maintain consistent border radius per element type
- Add hover states to clickable elements
- Support dark mode for all components

### DON'T ❌
- Mix different shadow styles in the same view
- Use thin borders (`border` or `border-1`)
- Forget hover states on interactive elements
- Use too many different gradient combinations
- Ignore dark mode styling
- Use sharp corners (`rounded-none`) for main UI

---

## 🚀 Quick Start Template

```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Page Title
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Page description
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card */}
          <div className="bg-white dark:bg-dark-bg rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Card Title
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Card content
            </p>
            <button className="w-full px-6 py-3 bg-linear-to-br from-[#38C9E6] to-[#43E8A0] text-white font-bold rounded-xl border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all">
              Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## ⚙️ Tailwind Configuration

Add these to your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1a1a',
        'dark-surface': '#2d2d2d',
      },
      backgroundImage: {
        'linear-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        'linear-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: 'class',
}
```

---

## 📚 Resources

- **Tailwind CSS**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Next.js**: https://nextjs.org

---

## 💡 Pro Tips

1. **Consistency is key** - Use the same shadow sizes throughout your app
2. **Test in dark mode** - Always check both light and dark themes
3. **Mobile first** - Design for mobile, then scale up
4. **Accessibility** - Ensure sufficient color contrast
5. **Performance** - Use `transition-all` sparingly on large elements
6. **Always use `border-2 border-gray-900`** for consistency
7. **Use `rounded-3xl` for cards**, `rounded-xl` for buttons
8. **Add hover states** to all interactive elements
9. **Use gradients** for primary actions only
10. **Keep shadows consistent** - don't mix different sizes in same view

---

**Created for:** Modern, bold, and playful web applications  
**Version:** 1.0  
**Last Updated:** 2024

---

Happy designing! 🎨✨

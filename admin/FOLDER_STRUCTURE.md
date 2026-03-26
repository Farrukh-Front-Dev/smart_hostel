# Admin Panel - Senior Developer Folder Structure

## Overview
The admin panel follows a professional, scalable folder structure that promotes code organization, maintainability, and team collaboration.

## Directory Structure

```
admin/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx                 # Main layout wrapper
│   │   ├── navbar/
│   │   │   ├── Navbar.tsx
│   │   │   ├── NavbarButton.tsx
│   │   │   ├── NavbarClock.tsx
│   │   │   ├── NavbarLanguageSelector.tsx
│   │   │   └── NavbarThemeToggle.tsx
│   │   └── sidebar/
│   │       ├── Sidebar.tsx
│   │       ├── SidebarLogo.tsx
│   │       ├── SidebarMenu.tsx
│   │       ├── SidebarFooter.tsx
│   │       ├── SidebarUserProfile.tsx
│   │       ├── SidebarLogoutButton.tsx
│   │       └── SidebarMobileButton.tsx
│   ├── common/
│   │   ├── Modal.tsx                  # Reusable modal component
│   │   ├── DataTable.tsx              # Data table with sorting/pagination
│   │   └── Squares.tsx                # Animated background grid
│   ├── ui/
│   │   ├── Button.tsx                 # Reusable button component
│   │   └── Badge.tsx                  # Status badge component
│   └── features/
│       └── StatCard.tsx               # Dashboard statistics card
├── lib/
│   ├── api/
│   │   ├── index.ts                   # API exports
│   │   ├── client.ts                  # Axios client configuration
│   │   └── endpoints.ts               # API endpoint definitions
│   ├── i18n/
│   │   └── index.ts                   # Internationalization (uz, en, ru)
│   └── credentials.json               # Test user credentials
├── pages/
│   ├── _app.tsx                       # App wrapper with providers
│   ├── _document.tsx                  # Document wrapper
│   ├── index.tsx                      # Dashboard page
│   ├── students.tsx                   # Students management page
│   ├── duties.tsx                     # Duties view page
│   ├── settings.tsx                   # Settings page
│   └── login.tsx                      # Login page
├── styles/
│   └── globals.css                    # Global styles and utilities
├── public/                            # Static assets
├── .env.local                         # Environment variables
├── .env.example                       # Environment template
├── next.config.js                     # Next.js configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript configuration
├── postcss.config.js                  # PostCSS configuration
└── package.json                       # Dependencies and scripts
```

## Component Organization

### Layout Components (`components/layout/`)
Handles the overall page structure and navigation.

**Main Layout:**
- `Layout.tsx` - Combines Sidebar, Navbar, and content area with animated background

**Navbar (`navbar/`):**
- `Navbar.tsx` - Main navigation bar with glassmorphism design
- `NavbarButton.tsx` - Reusable button for navbar controls
- `NavbarClock.tsx` - Real-time clock display
- `NavbarLanguageSelector.tsx` - Language switcher (uz, en, ru)
- `NavbarThemeToggle.tsx` - Dark/light mode toggle

**Sidebar (`sidebar/`):**
- `Sidebar.tsx` - Main sidebar with mobile responsiveness
- `SidebarLogo.tsx` - Logo and branding section
- `SidebarMenu.tsx` - Navigation menu items
- `SidebarFooter.tsx` - Footer wrapper for user profile and logout
- `SidebarUserProfile.tsx` - User profile card
- `SidebarLogoutButton.tsx` - Logout button
- `SidebarMobileButton.tsx` - Mobile menu toggle button

### Common Components (`components/common/`)
Reusable components used across multiple pages.

- `Modal.tsx` - Modal dialog with liquid glass styling
- `DataTable.tsx` - Sortable data table component
- `Squares.tsx` - Animated background grid (diagonal movement)

### UI Components (`components/ui/`)
Basic, reusable UI building blocks.

- `Button.tsx` - Button with variants (primary, secondary, danger, ghost)
- `Badge.tsx` - Status badge with color variants

### Feature Components (`components/features/`)
Page-specific or feature-specific components.

- `StatCard.tsx` - Statistics card for dashboard metrics

## Library Organization

### API (`lib/api/`)
Centralized API client and endpoint definitions.

- `client.ts` - Axios instance configuration
- `endpoints.ts` - API endpoint definitions (students, duties, reports)
- `index.ts` - Exports for easy importing

**Usage:**
```typescript
import { studentAPI, dutyAPI } from '@/lib/api';
```

### Internationalization (`lib/i18n/`)
Multi-language support (Uzbek, English, Russian).

- `index.ts` - Translation strings and helper functions

**Usage:**
```typescript
import { getTranslation } from '@/lib/i18n';
const text = getTranslation('uz', 'dashboard');
```

### Credentials (`lib/credentials.json`)
Test user credentials for authentication.

```json
{
  "users": [
    { "login": "rrangesi", "password": "02110542" },
    { "login": "admin", "password": "sevara" }
  ]
}
```

## Pages Organization

Each page represents a route in the application.

- `_app.tsx` - App wrapper with theme and language providers
- `_document.tsx` - HTML document structure
- `index.tsx` - Dashboard (home page)
- `students.tsx` - Student management
- `duties.tsx` - Duty schedule view
- `settings.tsx` - System settings
- `login.tsx` - Authentication page

## Import Patterns

### From Pages
```typescript
// Layout
import Layout from '@/components/layout/Layout';

// UI Components
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

// Common Components
import Modal from '@/components/common/Modal';
import DataTable from '@/components/common/DataTable';

// Features
import StatCard from '@/components/features/StatCard';

// API
import { studentAPI, dutyAPI } from '@/lib/api';

// i18n
import { getTranslation } from '@/lib/i18n';
```

### Within Components
```typescript
// Relative imports for nearby components
import NavbarButton from './NavbarButton';
import SidebarMenu from './SidebarMenu';

// Absolute imports for distant components
import Button from '@/components/ui/Button';
import { studentAPI } from '@/lib/api';
```

## Design System

### Colors
- **Primary Gradient**: `#38C9E6` to `#43E8A0` (Cyan to Green)
- **Dark Mode**: `dark:bg-gray-900`, `dark:text-white`
- **Light Mode**: `bg-white`, `text-gray-900`

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **Glassmorphism**: Transparent backgrounds with blur effects
- **3D Design**: Shadows, borders, and hover effects
- **Responsive**: Mobile-first design with breakpoints

### Component Patterns
- **Rounded**: `rounded-2xl` for most components
- **Pill Shaped**: `rounded-full` for buttons and badges
- **Borders**: `border-2 border-gray-900` for definition
- **Shadows**: `shadow-3d` for depth

## Best Practices

1. **Component Naming**: Use PascalCase for component files
2. **Folder Organization**: Group related components together
3. **Import Paths**: Use absolute imports (`@/`) for clarity
4. **Prop Types**: Define interfaces for component props
5. **Reusability**: Create generic components in `ui/` and `common/`
6. **Feature Isolation**: Keep feature-specific components in `features/`
7. **API Centralization**: All API calls through `lib/api/`
8. **Translations**: Use `lib/i18n/` for all text strings

## Scalability

This structure supports:
- **Adding new pages**: Create new file in `pages/`
- **Adding new features**: Create folder in `components/features/`
- **Adding new UI components**: Add to `components/ui/`
- **Adding new API endpoints**: Extend `lib/api/endpoints.ts`
- **Adding new languages**: Extend `lib/i18n/index.ts`

## Development Workflow

1. **Create new page**: Add file to `pages/`
2. **Create layout components**: Add to `components/layout/`
3. **Create reusable UI**: Add to `components/ui/`
4. **Create feature components**: Add to `components/features/`
5. **Add API endpoints**: Extend `lib/api/endpoints.ts`
6. **Add translations**: Extend `lib/i18n/index.ts`

## Performance Considerations

- **Code Splitting**: Next.js automatically splits code by page
- **Component Lazy Loading**: Use `dynamic()` for heavy components
- **Image Optimization**: Use Next.js `Image` component
- **CSS Optimization**: Tailwind purges unused styles in production

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Status**: Production Ready

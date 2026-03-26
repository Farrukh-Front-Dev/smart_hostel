# Admin Panel Component Structure

## Overview
The admin panel components have been reorganized into a well-structured hierarchy for better maintainability and scalability.

## Folder Structure

```
admin/components/
├── layout/
│   ├── Layout.tsx (Main layout wrapper)
│   ├── navbar/
│   │   ├── Navbar.tsx
│   │   ├── NavbarButton.tsx
│   │   ├── NavbarClock.tsx
│   │   ├── NavbarLanguageSelector.tsx
│   │   └── NavbarThemeToggle.tsx
│   └── sidebar/
│       ├── Sidebar.tsx
│       ├── SidebarLogo.tsx
│       ├── SidebarMenu.tsx
│       ├── SidebarFooter.tsx
│       ├── SidebarUserProfile.tsx
│       ├── SidebarLogoutButton.tsx
│       └── SidebarMobileButton.tsx
├── common/
│   ├── Modal.tsx
│   ├── DataTable.tsx
│   └── Squares.tsx (Animated background)
├── ui/
│   ├── Button.tsx
│   └── Badge.tsx
└── features/
    └── StatCard.tsx
```

## Component Categories

### Layout Components (`layout/`)
- **Layout.tsx**: Main layout wrapper that combines Sidebar, Navbar, and content area
- **navbar/**: Navigation bar and its sub-components
  - Clock display
  - Language selector
  - Theme toggle
- **sidebar/**: Sidebar navigation and its sub-components
  - Logo and branding
  - Menu items
  - User profile
  - Logout button
  - Mobile toggle button

### Common Components (`common/`)
- **Modal.tsx**: Reusable modal dialog component
- **DataTable.tsx**: Sortable data table with pagination support
- **Squares.tsx**: Animated background grid component

### UI Components (`ui/`)
- **Button.tsx**: Reusable button with multiple variants (primary, secondary, danger, ghost)
- **Badge.tsx**: Status badge component with color variants

### Feature Components (`features/`)
- **StatCard.tsx**: Statistics card for dashboard metrics

## Import Paths

### From Pages
```typescript
// Layout
import Layout from '../components/layout/Layout';

// UI Components
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

// Common Components
import Modal from '../components/common/Modal';
import DataTable from '../components/common/DataTable';

// Feature Components
import StatCard from '../components/features/StatCard';
```

### From Layout Components
```typescript
// Within layout/Layout.tsx
import Sidebar from './sidebar/Sidebar';
import Navbar from './navbar/Navbar';
import Squares from '../common/Squares';

// Within layout/sidebar/Sidebar.tsx
import SidebarMobileButton from './SidebarMobileButton';
import SidebarLogo from './SidebarLogo';
import SidebarMenu from './SidebarMenu';
import SidebarFooter from './SidebarFooter';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarLogoutButton from './SidebarLogoutButton';

// Within layout/navbar/Navbar.tsx
import NavbarClock from './NavbarClock';
import NavbarLanguageSelector from './NavbarLanguageSelector';
import NavbarThemeToggle from './NavbarThemeToggle';
```

## Benefits of This Structure

1. **Clear Organization**: Components are grouped by their purpose and hierarchy
2. **Easy Navigation**: Developers can quickly find components they need
3. **Scalability**: New components can be easily added to appropriate folders
4. **Maintainability**: Related components are grouped together
5. **Reusability**: Common and UI components are easily accessible from anywhere
6. **Separation of Concerns**: Layout, UI, and feature components are clearly separated

## Updated Files

All import statements in the following files have been automatically updated:
- `admin/pages/_app.tsx`
- `admin/pages/index.tsx`
- `admin/pages/students.tsx`
- `admin/pages/duties.tsx`
- `admin/pages/settings.tsx`
- `admin/pages/login.tsx`

## Verification

✅ All TypeScript imports are correct
✅ No compilation errors
✅ All component references updated
✅ Folder structure matches specification

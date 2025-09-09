# BOD Dashboard

A modern, responsive dashboard built with React, Redux Toolkit, and Tailwind CSS.

## Features

- **Modern UI**: Clean, responsive design with dark/light theme support
- **State Management**: Redux Toolkit for predictable state management
- **Data Management**: CRUD operations for entries, posts, and users
- **Search & Pagination**: Advanced filtering and pagination
- **Notifications**: Toast notifications for user feedback
- **Authentication**: JWT-based authentication system
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, Redux Toolkit, React Router
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios

## Project Structure

```
src/
├── api/                 # API layer
├── components/          # Reusable components
├── features/           # Redux slices
├── hooks/              # Custom hooks
├── layouts/            # Layout components
├── pages/              # Page components
├── store/              # Redux store configuration
├── styles/             # Global styles
├── utils/              # Utility functions
└── constants/          # Application constants
```

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Key Features

### Custom Hooks

- `useTable`: Handles table state, search, and pagination
- `useForm`: Manages form state and validation
- `useNotifications`: Provides notification functionality

### Components

- **Table**: Flexible, reusable table component
- **Modal**: Accessible modal component
- **Button**: Consistent button component with variants
- **SearchBar**: Debounced search input
- **Pagination**: Smart pagination component

### State Management

- **Entries**: CRUD operations for dashboard entries
- **Auth**: User authentication and session management
- **Theme**: Dark/light theme switching
- **Notifications**: Toast notification system

## Development

### Code Organization

- **Modular Structure**: Each feature has its own slice and components
- **Custom Hooks**: Reusable logic extracted into hooks
- **Type Safety**: PropTypes and consistent prop interfaces
- **Performance**: Optimized with React.memo and useMemo

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Built-in dark/light theme support
- **Responsive**: Mobile-first responsive design
- **Consistent**: Design system with reusable components

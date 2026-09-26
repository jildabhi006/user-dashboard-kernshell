# User Management Dashboard

A responsive User Management Dashboard built with React, TypeScript, Redux Toolkit, RTK Query, and Tailwind CSS.

The application provides a clean interface for managing users with Create, Read, Update, and Delete functionality, along with search, table/grid views, responsive layouts, loading states, validation, and error handling.

## Features

* User listing with responsive Table and Grid views
* Create new users
* Edit existing users
* Delete users with confirmation
* Search users
* Responsive design for desktop, tablet, and mobile
* Form validation
* Loading and error states
* Success/error feedback
* RTK Query for API communication and caching
* Redux Toolkit for UI state management
* Accessible and keyboard-friendly interactions

## Tech Stack

* React
* TypeScript
* Redux Toolkit
* RTK Query
* Tailwind CSS
* Vite
* JSONPlaceholder REST API

## API

This project uses the JSONPlaceholder API for user data and CRUD operations.

API Base URL:

`https://jsonplaceholder.typicode.com`

## Getting Started

### Prerequisites

* Node.js 18+
* npm

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### Run the Application

Start the development server:

```bash
npm run dev
```

The application will be available at the local development URL shown in the terminal.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```text
src/
├── app/
│   ├── store.ts
│   └── hooks.ts
│
├── features/
│   └── users/
│       ├── api/
│       ├── components/
│       ├── store/
│       ├── types/
│       └── index.ts
│
├── components/
│   └── ui/
│
├── App.tsx
├── main.tsx
└── index.css
```

The project follows a feature-based structure to keep API logic, UI components, state management, and types organized and maintainable.

## State Management

**RTK Query** is used for server state and API operations, including:

* Fetching users
* Creating users
* Updating users
* Deleting users
* Cache management
* Loading and error states

**Redux Toolkit** is used for client-side UI state such as:

* View mode
* Search query
* Modal state
* Selected user

## Responsive Design

The dashboard is designed to work across:

* Mobile: 375px+
* Tablet: 768px+
* Desktop: 1024px+
* Large screens: 1440px+

On smaller screens, the user table adapts into a mobile-friendly stacked layout to maintain usability without unnecessary horizontal scrolling.

## Development Notes

The application is structured with reusable components and separated responsibilities to keep the codebase maintainable and easy to extend.

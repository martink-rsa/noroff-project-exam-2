# Holidaze - Accommodation Booking Platform

A modern React application for accommodation booking with separate customer and venue manager functionality.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest + React Testing Library
- **Component Development**: Storybook
- **Date Handling**: date-fns

## Project Requirements

This is a Project Exam 2 assignment for a newly launched accommodation booking site called Holidaze. The application provides:

### User Types
- **Visitors**: Browse venues, search, view details
- **Customers**: Book accommodations, manage bookings, update profile
- **Venue Managers**: Create/manage venues, view bookings, update profile

### Key Features
- Venue browsing and search functionality
- User registration and authentication (stud.noroff.no emails only)
- Booking system with calendar availability
- Venue management for venue managers
- Profile management with avatar uploads

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Available Scripts

```bash
# Development
pnpm run dev              # Start development server
pnpm run build           # Build for production
pnpm run preview         # Preview production build

# Testing
pnpm test               # Run tests
pnpm run test:ui        # Run tests with UI
pnpm run coverage       # Run tests with coverage

# Component Development
pnpm run storybook      # Start Storybook
pnpm run build-storybook # Build Storybook

# Code Quality
pnpm run lint           # Run ESLint
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── services/         # API services
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── test/             # Test configuration
└── stories/          # Storybook stories
```

## API Integration

The application integrates with the Holidaze API:
- Base URL: `/holidaze/` (authenticated endpoints)
- Auth URL: `/auth/` (authentication endpoints)
- Authentication: JWT tokens
- Email restriction: Only `stud.noroff.no` addresses

### Key Endpoints
- `GET /holidaze/venues` - List venues
- `POST /holidaze/bookings` - Create booking
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

## Design System

The application uses Tailwind CSS 4 for styling with a custom design system including:
- Consistent color palette
- Typography scale
- Component variants
- Responsive design patterns

## Testing

Tests are written using Vitest and React Testing Library:
- Unit tests for components
- Integration tests for user flows
- Accessibility testing with jest-dom

## Documentation

Detailed project documentation is available in the `/docs` directory:
- [Assignment Brief](docs/ASSIGNMENT_BRIEF.md)
- [Project Details](docs/PROJECT_DETAILS.md)
- [API Documentation](docs/apis/)

## Deployment

The application can be deployed to:
- Netlify
- Vercel
- GitHub Pages

Build the project with `pnpm run build` and deploy the `dist` folder.

## License

This project is for educational purposes as part of the Noroff Project Exam 2.
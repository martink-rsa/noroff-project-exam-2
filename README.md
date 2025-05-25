# Holidaze - Accommodation Booking Platform

A modern React application for accommodation booking with separate customer and venue manager functionality. Built as part of Noroff Project Exam 2.

## 🏨 Project Overview

Holidaze is a newly launched accommodation booking site that allows users to browse and book holiday accommodations. The platform serves three types of users:

- **Visitors**: Browse venues, search accommodations, view details
- **Customers**: Register, book accommodations, manage bookings and profile
- **Venue Managers**: Create and manage venues, view bookings, handle business operations

## 🚀 Tech Stack

### Core Technologies
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 with Vite plugin
- **Routing**: React Router v7
- **State Management**: React Context + Custom Hooks

### Forms & Validation
- **Forms**: React Hook Form
- **Validation**: Zod schemas
- **Date Handling**: date-fns

### Development & Testing
- **Testing**: Vitest + React Testing Library + jest-dom
- **Component Development**: Storybook 8
- **Code Quality**: ESLint + TypeScript strict mode
- **Package Manager**: pnpm

### Utilities
- **CSS Classes**: clsx for conditional styling
- **Performance**: Lazy loading, image optimization
- **Accessibility**: Semantic HTML, ARIA support

## 📋 Key Features

### 🔍 Venue Discovery
- Browse all available venues
- Advanced search and filtering
- Detailed venue information with image galleries
- Calendar-based availability checking
- Responsive grid layout

### 👤 User Management
- Secure registration (stud.noroff.no emails only)
- JWT-based authentication
- Profile management with avatar uploads
- Role-based access (Customer vs Venue Manager)

### 📅 Booking System
- Real-time availability checking
- Booking creation and management
- Customer booking history
- Manager booking overview
- Calendar integration

### 🏢 Venue Management (Managers Only)
- Create new venues with detailed information
- Upload multiple venue images
- Edit existing venue details
- Delete venues
- View and manage venue bookings
- Set pricing and availability

### 📱 User Experience
- Fully responsive design
- Intuitive navigation
- Error handling with user feedback
- Loading states and animations
- Accessibility compliance

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: v18 or higher
- **pnpm**: Latest version (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd holidaze-app

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Development Server
The application will be available at `http://localhost:5173` (default Vite port).

## 📜 Available Scripts

### Primary Development
```bash
pnpm run dev              # Start development server
pnpm run build           # Build for production (includes TypeScript compilation)
pnpm run preview         # Preview production build locally
pnpm run lint            # Run ESLint for code quality
```

### Testing
```bash
pnpm test               # Run tests in watch mode
pnpm run test:ui        # Run tests with Vitest UI interface
pnpm run coverage       # Generate test coverage report
```

### Component Development
```bash
pnpm run storybook      # Start Storybook on port 6006
pnpm run build-storybook # Build Storybook for production
```

## 🏗️ Project Architecture

### Folder Structure
```
src/
├── components/           # Reusable UI components (colocated structure)
│   ├── BookingCard/     # BookingCard component with stories & tests
│   │   ├── BookingCard.tsx
│   │   ├── BookingCard.stories.tsx
│   │   ├── BookingCard.test.tsx
│   │   └── index.ts
│   ├── Pagination/      # Pagination component with stories & tests
│   ├── SearchBar/       # SearchBar component with stories & tests
│   ├── VenueCard/       # VenueCard component with stories & tests
│   ├── ui/              # Basic UI elements (colocated stories/tests)
│   ├── forms/           # Form components (LoginForm, RegisterForm)
│   └── layout/          # Layout components (Header, Footer, Layout)
├── pages/               # Route-based page components
│   ├── manager/         # Venue manager specific pages
│   └── index.ts         # Centralized page exports
├── hooks/               # Custom React hooks for logic reuse
├── services/            # API integration and data fetching
├── types/               # TypeScript definitions and Zod schemas
├── utils/               # Utility functions and helpers
├── context/             # React Context providers (Auth, Toast)
├── test/                # Test configuration and setup files
└── assets/              # Static assets (images, icons)
```

### Component Organization
- **Colocated Structure**: Each component has its own folder with component, stories, and tests together
- **UI Components**: Basic reusable elements (buttons, inputs, loading spinners)
- **Feature Components**: Complex components like BookingCard, VenueCard, SearchBar, Pagination
- **Page Components**: Route-specific containers that compose UI components
- **Layout Components**: Shared layout elements (header, footer, navigation)
- **Form Components**: Complete form implementations with validation

### State Management Strategy
- **Authentication**: Context provider with JWT token management
- **UI State**: Local component state and custom hooks
- **Server State**: React Query pattern with custom hooks
- **Form State**: React Hook Form with Zod validation

## 🔗 API Integration

### Base Configuration
- **API Base**: Noroff Holidaze API
- **Authentication Endpoints**: `/auth/` prefix
- **Protected Endpoints**: `/holidaze/` prefix
- **Authentication**: Bearer token (JWT)
- **Email Restriction**: Only `@stud.noroff.no` addresses

### Key API Endpoints

#### Authentication
- `POST /auth/register` - User registration with role selection
- `POST /auth/login` - User authentication and token generation

#### Venues
- `GET /holidaze/venues` - List venues with search, filter, and pagination
- `GET /holidaze/venues/{id}` - Get detailed venue information
- `POST /holidaze/venues` - Create new venue (managers only)
- `PUT /holidaze/venues/{id}` - Update venue details (managers only)
- `DELETE /holidaze/venues/{id}` - Delete venue (managers only)

#### Bookings
- `GET /holidaze/bookings` - List user bookings
- `POST /holidaze/bookings` - Create new booking
- `GET /holidaze/bookings/{id}` - Get booking details
- `PUT /holidaze/bookings/{id}` - Update booking
- `DELETE /holidaze/bookings/{id}` - Cancel booking

#### Profiles
- `GET /holidaze/profiles/{name}` - Get user profile
- `PUT /holidaze/profiles/{name}` - Update profile information
- `PUT /holidaze/profiles/{name}/media` - Update profile avatar

### API Features
- **Search & Filter**: Venue search by name, location, amenities
- **Pagination**: Efficient data loading with page-based navigation
- **Error Handling**: Comprehensive error responses with user-friendly messages
- **Rate Limiting**: Respectful API usage with proper request handling

## 🎨 Design System

### Tailwind CSS Configuration
The application uses Tailwind CSS 4 with a custom design system:

#### Color Palette
- **Primary**: Blue-based brand colors
- **Secondary**: Complementary accent colors
- **Neutral**: Grayscale for text and backgrounds
- **Status**: Success, warning, error, and info colors

#### Typography
- **Headings**: Consistent scale from h1 to h6
- **Body Text**: Readable font sizes and line heights
- **Special**: Captions, labels, and code text

#### Components
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Consistent input styling with validation states
- **Cards**: Venue cards, booking cards, and information displays
- **Navigation**: Header, footer, and in-page navigation

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl, 2xl responsive breakpoints
- **Touch Friendly**: Appropriate touch targets and spacing
- **Performance**: Optimized images and efficient CSS

## 🧪 Testing Strategy

### Testing Framework
- **Test Runner**: Vitest (fast, ESM-native)
- **React Testing**: React Testing Library
- **DOM Testing**: jest-dom matchers
- **User Interactions**: @testing-library/user-event

### Testing Coverage
- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interaction and data flow
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Form Tests**: Validation and submission workflows

### Test Organization
```
src/
├── components/
│   ├── BookingCard/
│   │   └── BookingCard.test.tsx    # Colocated component tests
│   ├── SearchBar/
│   │   └── SearchBar.test.tsx      # Colocated component tests
│   └── ui/
│       ├── ErrorMessage.test.tsx   # Colocated UI tests
│       └── LoadingSpinner.test.tsx # Colocated UI tests
├── hooks/
│   └── __tests__/       # Hook testing with renderHook
├── services/
│   └── __tests__/       # API service testing with mocks
└── test/
    └── setup.ts         # Global test configuration
```

### Running Tests
```bash
# Run all tests
pnpm test

# Run with coverage
pnpm run coverage

# Run with UI (browser-based test runner)
pnpm run test:ui
```

## 📖 Documentation

### Project Documentation
Comprehensive documentation is available in the `/docs` directory:

- **[Assignment Brief](docs/ASSIGNMENT_BRIEF.md)**: Complete project requirements
- **[Project Details](docs/PROJECT_DETAILS.md)**: Technical specifications
- **[API Documentation](docs/apis/)**: Endpoint specifications and examples
  - [API Key Setup](docs/apis/api-key.mdx)
  - [Authentication](docs/apis/login.mdx)
  - [User Registration](docs/apis/register.mdx)
  - [Venues Management](docs/apis/venues.mdx)
  - [Bookings](docs/apis/bookings.mdx)
  - [User Profiles](docs/apis/profiles.mdx)

### Component Documentation
- **Storybook**: Interactive component documentation and testing
- **TypeScript**: Self-documenting code with comprehensive type definitions
- **README Files**: Component-specific documentation where needed

## 🚀 Deployment

### Build Process
```bash
# Create production build
pnpm run build

# Preview production build locally
pnpm run preview
```

### Deployment Platforms
The application is optimized for deployment on:

- **Netlify**: Automatic deployments with build optimization
- **Vercel**: Zero-configuration deployment with edge functions
- **GitHub Pages**: Static site hosting with GitHub Actions
- **Other Static Hosts**: Any platform supporting static sites

### Build Output
- **Location**: `dist/` directory
- **Assets**: Optimized images, CSS, and JavaScript bundles
- **HTML**: Pre-rendered HTML with meta tags for SEO

### Environment Configuration
- **API URLs**: Configure API endpoints for different environments
- **Feature Flags**: Enable/disable features based on environment
- **Analytics**: Add tracking and monitoring for production

## 🔒 Security Considerations

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Customer vs Venue Manager permissions
- **Email Validation**: Restricted to educational domain
- **Token Management**: Automatic refresh and secure storage

### Data Protection
- **Input Validation**: Client and server-side validation
- **XSS Prevention**: Sanitized user inputs and outputs
- **CSRF Protection**: Token-based request validation
- **Secure Headers**: Content Security Policy and other security headers

## 🎯 Performance Optimization

### Loading Performance
- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Images and non-critical components
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Strategic caching of API responses and assets

### Runtime Performance
- **React Optimization**: Memoization and efficient re-renders
- **Image Optimization**: Responsive images with proper formats
- **Network Optimization**: Request batching and efficient data fetching
- **Accessibility**: Optimized for screen readers and keyboard navigation

## 🤝 Contributing

### Development Workflow
1. **Branch**: Create feature branch from `main`
2. **Develop**: Write code following project standards
3. **Test**: Ensure all tests pass and coverage is maintained
4. **Lint**: Run ESLint and fix any issues
5. **Commit**: Use descriptive commit messages
6. **PR**: Create pull request for code review

### Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Comprehensive linting rules
- **Testing**: Minimum 80% test coverage
- **Documentation**: Update docs for new features
- **Accessibility**: Maintain WCAG compliance

## 📄 License

This project is developed for educational purposes as part of the Noroff Project Exam 2. All rights reserved for academic use.

## 🆘 Support

For questions, issues, or contributions:

1. **Documentation**: Check the `/docs` directory first
2. **Issues**: Create GitHub issues for bugs or feature requests
3. **Discussions**: Use GitHub Discussions for questions
4. **Code Review**: Submit pull requests for improvements

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
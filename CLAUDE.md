# Holidaze Project Guidelines

## Documentation
Always reference the comprehensive docs in `/docs` directory:
- Assignment Brief and Project Details contain full requirements
- API documentation in `/docs/apis/` for endpoint specifications
- Follow the user stories and technical requirements exactly

## Tech Stack Requirements
- **React 19** with TypeScript (required)
- **Vite 6** for build tooling (configured)
- **Tailwind CSS 4** (required, configured with Vite plugin)
- **React Router v7** for routing (configured)
- **React Hook Form** with **Zod** validation (required)
- **Vitest** + **React Testing Library** for testing (required)
- **Storybook 8** for component development (required)
- **date-fns** for date handling (configured)
- **clsx** for conditional CSS classes (configured)

## Development Commands
**Use `pnpm` instead of `npm` for all package management commands**

### Primary Commands
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production (includes TypeScript compilation)
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint for code quality

### Testing Commands
- `pnpm test` - Run tests in watch mode
- `pnpm run test:ui` - Run tests with Vitest UI
- `pnpm run coverage` - Run tests with coverage report

### Storybook Commands
- `pnpm run storybook` - Start Storybook development server (port 6006)
- `pnpm run build-storybook` - Build Storybook for production

### Package Management
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new packages
- `pnpm add -D <package>` - Add development dependencies

## Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── BookingCard/     # BookingCard component
│   │   ├── BookingCard.tsx
│   │   ├── BookingCard.stories.tsx
│   │   ├── BookingCard.test.tsx (if exists)
│   │   └── index.ts
│   ├── Pagination/      # Pagination component
│   │   ├── Pagination.tsx
│   │   ├── Pagination.stories.ts
│   │   ├── Pagination.test.tsx (if exists)
│   │   └── index.ts
│   ├── SearchBar/       # SearchBar component
│   │   ├── SearchBar.tsx
│   │   ├── SearchBar.stories.ts
│   │   ├── SearchBar.test.tsx
│   │   └── index.ts
│   ├── VenueCard/       # VenueCard component
│   │   ├── VenueCard.tsx
│   │   ├── VenueCard.stories.tsx
│   │   ├── VenueCard.test.tsx
│   │   └── index.ts
│   ├── ui/              # Basic UI components (colocated stories/tests)
│   │   ├── ErrorMessage.tsx
│   │   ├── ErrorMessage.stories.ts
│   │   ├── ErrorMessage.test.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoadingSpinner.stories.ts
│   │   ├── LoadingSpinner.test.tsx
│   │   ├── LazyImage.tsx
│   │   └── index.ts
│   ├── forms/           # Form components (LoginForm, RegisterForm)
│   └── layout/          # Layout components (Header, Footer, Layout)
├── pages/               # Page components and routing
│   ├── manager/         # Venue manager specific pages
│   └── index.ts         # Page exports
├── hooks/               # Custom React hooks
├── services/            # API integration layer
├── types/               # TypeScript definitions and schemas
├── utils/               # Helper functions and utilities
├── context/             # React Context providers
├── test/                # Test configuration and setup
└── assets/              # Static assets
```

## API Integration
### Base Configuration
- **Authenticated endpoints**: Use `/holidaze/` prefix
- **Authentication endpoints**: Use `/auth/` prefix
- **Email restriction**: Only `stud.noroff.no` domain allowed
- **Authentication**: JWT tokens from login response
- **API Key**: Required for all requests (see docs/apis/api-key.mdx)

### Key Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /holidaze/venues` - List venues with search/filter
- `POST /holidaze/venues` - Create venue (managers only)
- `GET /holidaze/venues/{id}` - Get venue details
- `PUT /holidaze/venues/{id}` - Update venue (managers only)
- `DELETE /holidaze/venues/{id}` - Delete venue (managers only)
- `POST /holidaze/bookings` - Create booking
- `GET /holidaze/profiles/{name}` - Get user profile
- `PUT /holidaze/profiles/{name}` - Update user profile

## User Roles & Features
### Visitors (Unauthenticated)
- Browse and search venues
- View venue details and availability
- Register for customer or manager account

### Customers (Authenticated)
- All visitor functionality
- Create and manage bookings
- View booking history
- Update profile with avatar

### Venue Managers (Authenticated + venueManager flag)
- All customer functionality
- Create, edit, and delete venues
- View bookings for their venues
- Manage venue availability and pricing

## Form Validation & Data Handling
- **All forms** must use React Hook Form with Zod validation
- **Error handling**: Implement proper error boundaries and user feedback
- **Loading states**: Show appropriate loading indicators
- **Success feedback**: Provide confirmation for successful actions
- **Input validation**: Real-time validation with helpful error messages

## Code Standards & Best Practices
### TypeScript
- Use strict TypeScript configuration
- Define interfaces/types for all data structures
- Avoid `any` type - use proper typing
- Use Zod schemas for runtime validation

### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization where needed
- Follow React Hook rules and dependencies
- Use proper key props for lists

### Testing Requirements
- Write unit tests for all components
- Test user interactions and form submissions
- Test API integration with mock data
- Maintain high test coverage (aim for >80%)
- Use React Testing Library for component testing
- Include accessibility testing

### Performance & Accessibility
- Implement lazy loading for images
- Use semantic HTML elements
- Ensure keyboard navigation support
- Provide proper ARIA labels and descriptions
- Maintain good Lighthouse scores
- Optimize bundle size and loading times

### Styling Guidelines
- Use Tailwind CSS 4 utility classes
- Follow consistent spacing and typography scales
- Implement responsive design patterns
- Use CSS custom properties for theme values
- Maintain design system consistency

## Git Workflow
- Work on feature branches
- Use descriptive commit messages
- Run tests before committing
- Ensure lint passes before pushing
- Create pull requests for code review

## Development Environment
### Required Tools
- Node.js (v18 or higher)
- pnpm (latest version)
- VS Code (recommended)
- Git

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- React snippets

## Deployment
- Build with `pnpm run build`
- Deploy `dist` folder to hosting platform
- Ensure environment variables are configured
- Test production build before deployment

## Troubleshooting
### Common Issues
- **Port conflicts**: Development server runs on default Vite port
- **TypeScript errors**: Check tsconfig.json configuration
- **API failures**: Verify API key and endpoint URLs
- **Build failures**: Check for TypeScript compilation errors

### Debug Steps
1. Clear node_modules and reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
2. Check browser console for errors
3. Verify API responses in Network tab
4. Run tests to identify breaking changes
5. Check Git status for uncommitted changes

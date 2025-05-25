# Holidaze Project Guidelines

## Documentation
Always reference the comprehensive docs in `/docs` directory:
- Assignment Brief and Project Details contain full requirements
- API documentation in `/docs/apis/` for endpoint specifications
- Follow the user stories and technical requirements exactly

## Tech Stack Requirements
- **React 19** with TypeScript (required)
- **Tailwind CSS 4** (required, already configured with Vite plugin)
- **Zod** for validation (required)
- **React Testing Library** for testing (required)
- **Storybook** for component development (required)

## Development Commands
**Use `pnpm` instead of `npm` for all package management commands**
- `pnpm run dev` - Development server
- `pnpm test` - Run tests  
- `pnpm run storybook` - Component development
- `pnpm run build` - Production build
- `pnpm run lint` - Code linting
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new packages

## Project Structure
- `/src/components/` - Reusable UI components
- `/src/pages/` - Page components and routing
- `/src/services/` - API integration layer
- `/src/types/` - TypeScript definitions
- `/src/hooks/` - Custom React hooks
- `/src/utils/` - Helper functions

## API Integration
- Base URL: Use `/holidaze/` for authenticated endpoints
- Auth URL: Use `/auth/` for authentication
- Email restriction: Only `stud.noroff.no` domain allowed
- Authentication: JWT tokens from login response

## Key Features to Implement
1. **Visitor functionality**: Browse venues, search, view details
2. **Customer features**: Registration, login, booking creation, profile management
3. **Venue Manager features**: Venue CRUD operations, booking management
4. **Calendar integration**: Show availability based on existing bookings
5. **Form validation**: Use Zod schemas for all forms

## Code Standards
- Always use TypeScript interfaces/types
- Implement proper error handling
- Follow React best practices
- Write tests for components and utilities
- Use semantic HTML and accessibility practices

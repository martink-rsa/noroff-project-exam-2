# Holidaze - Accommodation Booking Application

## Project Overview

**Client**: Holidaze (newly launched accommodation booking site)
**Objective**: Develop a modern front-end accommodation booking application with customer and admin functionality
**Duration**: 6 weeks (Full-time) | 14 weeks (Part-time)
**API Base URL**: `/holidaze/` (authenticated endpoints) and `/auth/` (authentication endpoints)

## User Types & Permissions

### Visitor (Non-registered users)

- View list of venues (`GET /holidaze/venues`)
- Search for specific venues (`GET /holidaze/venues/search?q=<query>`)
- View individual venue pages (`GET /holidaze/venues/<id>`)
- Register as Customer or Venue Manager (`POST /auth/register`)

### Customer (Registered users with stud.noroff.no email)

- All visitor permissions
- Login/logout functionality (`POST /auth/login`)
- Create bookings at venues (`POST /holidaze/bookings`)
- View upcoming bookings (`GET /holidaze/profiles/<name>/bookings`)
- Update avatar/profile picture (`PUT /holidaze/profiles/<name>`)

### Venue Manager (Registered users with stud.noroff.no email and venueManager: true)

- All visitor permissions
- Login/logout functionality (`POST /auth/login`)
- Create new venues (`POST /holidaze/venues`)
- Edit/update managed venues (`PUT /holidaze/venues/<id>`)
- Delete managed venues (`DELETE /holidaze/venues/<id>`)
- View bookings for managed venues (`GET /holidaze/venues/<id>?_bookings=true`)
- Update avatar/profile picture (`PUT /holidaze/profiles/<name>`)

## Technical Requirements

### Required Tech Stack

- **Languages**: TypeScript (required)
- **Framework**: React 19 (required)
- **CSS Framework**: Tailwind CSS 4 (required)
- **Validation**: Zod (required)
- **Testing**: React Testing Library (required)
- **Hosting**: GitHub Pages, Netlify, Vercel
- **Design**: Adobe XD, Figma
- **Planning**: Trello, GitHub Projects

### Additional Dependencies

- **HTTP Client**: Fetch API or Axios for API requests
- **Routing**: React Router v6
- **State Management**: React Context API + useReducer (or Zustand if needed)
- **Date Handling**: date-fns or dayjs for calendar functionality
- **Form Handling**: React Hook Form (recommended with Zod)
- **Image Optimization**: Consider lazy loading libraries

### API Integration Details

- **Base URL**: API endpoints use `/holidaze/` and `/auth/` prefixes
- **Authentication**: JWT tokens via `accessToken` in login response
- **Email Restriction**: Only `stud.noroff.no` email addresses allowed
- **Pagination**: Supported on list endpoints with meta information
- **Search**: Available for venues and profiles

## Data Models

### User/Profile Model

```typescript
interface Profile {
  name: string;
  email: string;
  bio?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  banner?: {
    url: string;
    alt?: string;
  };
  venueManager: boolean;
  _count?: {
    venues: number;
    bookings: number;
  };
}
```

### Venue Model

```typescript
interface Venue {
  id: string;
  name: string;
  description: string;
  media?: Array<{
    url: string;
    alt?: string;
  }>;
  price: number;
  maxGuests: number;
  rating?: number;
  created: string;
  updated: string;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    lat?: number;
    lng?: number;
  };
  owner?: Profile; // When _owner=true
  bookings?: Booking[]; // When _bookings=true
}
```

### Booking Model

```typescript
interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: Venue; // When _venue=true
  customer?: Profile; // When _customer=true
}
```

## Site Structure & Pages

### Public Pages (All Users)

1. **Home Page** (`/`)

   - Hero section with search functionality
   - Featured venues (using `GET /holidaze/venues`)
   - Call-to-action for registration

2. **Venues Page** (`/venues`)

   - List view of all venues (`GET /holidaze/venues`)
   - Search functionality (`GET /holidaze/venues/search?q=<query>`)
   - Pagination support
   - Sort options (price, rating, location)

3. **Venue Details Page** (`/venues/:id`)

   - Venue information (`GET /holidaze/venues/<id>?_bookings=true&_owner=true`)
   - Availability calendar (from bookings data)
   - Booking form (for logged-in customers)
   - Owner information
   - Location details and amenities

4. **Search Results Page** (`/search`)
   - Filtered venue results (`GET /holidaze/venues/search?q=<query>`)
   - Search refinement options
   - Sort functionality

### Authentication Pages

5. **Login Page** (`/login`)

   - Login form (`POST /auth/login`)
   - Role display (venueManager boolean)
   - Registration links

6. **Register Page** (`/register`)
   - Customer/Venue Manager registration (`POST /auth/register`)
   - Email validation (stud.noroff.no required)
   - Optional bio, avatar, banner fields
   - venueManager checkbox

### Customer-Specific Pages

7. **Customer Dashboard** (`/dashboard`)

   - Welcome message with profile data
   - Quick stats from profile (`GET /holidaze/profiles/<name>?_bookings=true`)
   - Navigation to customer features

8. **My Bookings Page** (`/bookings`)

   - List of bookings (`GET /holidaze/profiles/<name>/bookings?_venue=true`)
   - Booking details with venue information
   - Update booking option (`PUT /holidaze/bookings/<id>`)
   - Cancel booking option (`DELETE /holidaze/bookings/<id>`)

9. **Customer Profile Page** (`/profile`)
   - Edit personal information (`PUT /holidaze/profiles/<name>`)
   - Avatar/banner upload functionality
   - Bio editing (160 character limit)

### Venue Manager-Specific Pages

10. **Manager Dashboard** (`/manager/dashboard`)

    - Welcome message with profile data
    - Quick stats (`GET /holidaze/profiles/<name>?_venues=true&_bookings=true`)
    - Recent activity overview

11. **My Venues Page** (`/manager/venues`)

    - List of managed venues (`GET /holidaze/profiles/<name>/venues`)
    - Add new venue button
    - Edit/delete options for each venue
    - Venue performance metrics

12. **Create Venue Page** (`/manager/venues/create`)

    - Venue creation form (`POST /holidaze/venues`)
    - Image upload (media array)
    - Amenities selection (meta object)
    - Location and pricing setup

13. **Edit Venue Page** (`/manager/venues/:id/edit`)

    - Pre-populated venue edit form (`PUT /holidaze/venues/<id>`)
    - Update all venue properties
    - Image management

14. **Venue Bookings Page** (`/manager/venues/:id/bookings`)

    - Venue bookings (`GET /holidaze/venues/<id>?_bookings=true`)
    - Calendar view of reservations
    - Customer information for each booking

15. **Manager Profile Page** (`/manager/profile`)
    - Edit personal information (`PUT /holidaze/profiles/<name>`)
    - Avatar/banner upload functionality
    - venueManager status display

### Utility Pages

16. **404 Error Page** (`/404`)

    - User-friendly error message
    - Navigation back to home

17. **About Page** (`/about`)
    - Company information
    - How it works
    - Contact details

## API Integration Details

### Authentication Endpoints

#### Register User

- **Endpoint**: `POST /auth/register`
- **Required**: name, email (stud.noroff.no), password (8+ chars)
- **Optional**: bio (160 chars), avatar, banner, venueManager
- **Response**: User profile data

#### Login User

- **Endpoint**: `POST /auth/login`
- **Required**: email, password
- **Query Param**: `?_holidaze=true` (includes venueManager boolean)
- **Response**: User profile + accessToken

### Venue Endpoints

#### Get All Venues

- **Endpoint**: `GET /holidaze/venues`
- **Public**: No authentication required
- **Query Params**: `?_owner=true&_bookings=true`
- **Supports**: Pagination, sorting

#### Get Single Venue

- **Endpoint**: `GET /holidaze/venues/<id>`
- **Public**: No authentication required
- **Query Params**: `?_owner=true&_bookings=true`

#### Search Venues

- **Endpoint**: `GET /holidaze/venues/search?q=<query>`
- **Public**: No authentication required
- **Searches**: name and description properties

#### Create Venue (Venue Managers Only)

- **Endpoint**: `POST /holidaze/venues`
- **Required**: name, description, price, maxGuests
- **Optional**: media, rating, meta, location

#### Update Venue (Venue Managers Only)

- **Endpoint**: `PUT /holidaze/venues/<id>`
- **Optional**: All venue properties can be updated

#### Delete Venue (Venue Managers Only)

- **Endpoint**: `DELETE /holidaze/venues/<id>`
- **Response**: 204 No Content

### Booking Endpoints

#### Create Booking (Customers Only)

- **Endpoint**: `POST /holidaze/bookings`
- **Required**: dateFrom, dateTo, guests, venueId
- **Date Format**: ISO string (new Date())

#### Get All Bookings

- **Endpoint**: `GET /holidaze/bookings`
- **Query Params**: `?_customer=true&_venue=true`

#### Get Single Booking

- **Endpoint**: `GET /holidaze/bookings/<id>`
- **Query Params**: `?_customer=true&_venue=true`

#### Update Booking

- **Endpoint**: `PUT /holidaze/bookings/<id>`
- **Optional**: dateFrom, dateTo, guests

#### Delete Booking

- **Endpoint**: `DELETE /holidaze/bookings/<id>`
- **Response**: 204 No Content

### Profile Endpoints

#### Get All Profiles

- **Endpoint**: `GET /holidaze/profiles`
- **Query Params**: `?_bookings=true&_venues=true`

#### Get Single Profile

- **Endpoint**: `GET /holidaze/profiles/<name>`
- **Query Params**: `?_bookings=true&_venues=true`

#### Update Profile

- **Endpoint**: `PUT /holidaze/profiles/<name>`
- **Optional**: bio, avatar, banner, venueManager
- **Image URLs**: Must be publicly accessible

#### Get Profile Bookings

- **Endpoint**: `GET /holidaze/profiles/<name>/bookings`
- **Same as**: bookings endpoint with filters

#### Get Profile Venues

- **Endpoint**: `GET /holidaze/profiles/<name>/venues`
- **Same as**: venues endpoint with filters

#### Search Profiles

- **Endpoint**: `GET /holidaze/profiles/search?q=<query>`
- **Searches**: name and bio properties

## Key Features & Components

### Core Components

- **Header/Navigation**

  - Logo and main navigation
  - Authentication status display
  - Search bar integration
  - Mobile-responsive design

- **Footer**

  - Company information
  - Social media links
  - Legal and contact links

- **Search Component**

  - Location-based search
  - Date range picker (check-in/check-out)
  - Guest count selector
  - Advanced filters for amenities

- **Venue Card Component**

  - Image gallery display
  - Name, location, and description
  - Price per night display
  - Rating and amenities
  - Availability indicator

- **Calendar Component**

  - Visual date availability
  - Booking date selection
  - Blocked dates display from bookings data

- **Booking Form**
  - Date validation against venue bookings
  - Guest count validation (maxGuests)
  - Total price calculation
  - Form submission to create booking

### Authentication System

- JWT token storage and management
- Role-based routing (customer vs venue manager)
- Protected route components
- Automatic token refresh handling
- Session persistence across browser sessions

### Form Validation with Zod Schemas

```typescript
import { z } from 'zod';

// Registration schema
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Name can only contain letters, numbers, and underscores',
    ),
  email: z
    .string()
    .email('Invalid email format')
    .endsWith('@stud.noroff.no', 'Email must be from stud.noroff.no domain'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  venueManager: z.boolean().default(false),
  avatar: z
    .object({
      url: z.string().url('Must be a valid URL'),
      alt: z
        .string()
        .max(120, 'Alt text must be less than 120 characters')
        .optional(),
    })
    .optional(),
  banner: z
    .object({
      url: z.string().url('Must be a valid URL'),
      alt: z
        .string()
        .max(120, 'Alt text must be less than 120 characters')
        .optional(),
    })
    .optional(),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Venue creation schema
const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  maxGuests: z.number().min(1, 'Must allow at least 1 guest'),
  media: z
    .array(
      z.object({
        url: z.string().url('Must be a valid URL'),
        alt: z.string().optional(),
      }),
    )
    .optional(),
  meta: z
    .object({
      wifi: z.boolean().default(false),
      parking: z.boolean().default(false),
      breakfast: z.boolean().default(false),
      pets: z.boolean().default(false),
    })
    .optional(),
  location: z
    .object({
      address: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
      continent: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
});

// Booking schema
const bookingSchema = z
  .object({
    dateFrom: z.string().datetime('Invalid date format'),
    dateTo: z.string().datetime('Invalid date format'),
    guests: z.number().min(1, 'Must have at least 1 guest'),
    venueId: z.string().min(1, 'Venue ID is required'),
  })
  .refine((data) => new Date(data.dateTo) > new Date(data.dateFrom), {
    message: 'End date must be after start date',
    path: ['dateTo'],
  });
```

## Development Process Checklist

### 1. Setup & Planning

- [ ] Create GitHub repository
- [ ] Set up Kanban board (GitHub Projects/Trello)
- [ ] Create Gantt chart with roadmap view
- [ ] Study API documentation thoroughly
- [ ] Test API endpoints with provided API key

### 2. Design Phase

- [ ] Create style guide in Figma
  - [ ] Logo design/integration
  - [ ] Font pairings selection
  - [ ] Color palette (primary/secondary)
  - [ ] Component library design
- [ ] Create desktop prototype in Figma
- [ ] Create mobile prototype in Figma
- [ ] Design system documentation

### 3. Development Setup

- [ ] Initialize React project with TypeScript
- [ ] Configure chosen CSS framework
- [ ] Set up React Router for navigation
- [ ] Create API service layer
- [ ] Implement authentication context
- [ ] Set up environment variables

### 4. Core Development

#### Authentication System

- [ ] Create registration form with validation
- [ ] Implement login functionality
- [ ] Set up JWT token management
- [ ] Create protected route components
- [ ] Implement role-based navigation

#### Venue Management

- [ ] Build venue listing page with pagination
- [ ] Create venue detail page with booking calendar
- [ ] Implement venue search functionality
- [ ] Build venue creation form (managers)
- [ ] Create venue edit/delete functionality

#### Booking System

- [ ] Implement booking creation flow
- [ ] Build customer booking history
- [ ] Create booking management for venues
- [ ] Add booking update/cancellation
- [ ] Implement date validation logic

#### Profile Management

- [ ] Create profile view/edit pages
- [ ] Implement avatar/banner upload
- [ ] Build user dashboards
- [ ] Add profile statistics display

### 5. Testing & Optimization

- [ ] Manual testing of all user stories
- [ ] API integration testing
- [ ] HTML Markup Validation
- [ ] Lighthouse performance testing
- [ ] WAVE accessibility testing
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness testing

### 6. Deployment

- [ ] Build production version
- [ ] Configure environment variables for production
- [ ] Deploy to chosen hosting platform
- [ ] Test deployed version thoroughly
- [ ] Configure custom domain (if applicable)

### 7. Documentation

- [ ] Write comprehensive README.md
- [ ] Include setup and installation instructions
- [ ] Document API integration patterns
- [ ] Add screenshots and demo links
- [ ] Include troubleshooting section

## User Stories Implementation

### All Users

- [ ] **View venues list**: Implement venues page with API integration (`GET /holidaze/venues`)
- [ ] **Search venues**: Build search component (`GET /holidaze/venues/search?q=<query>`)
- [ ] **View venue details**: Create detailed venue pages (`GET /holidaze/venues/<id>?_bookings=true`)
- [ ] **Registration**: Implement registration forms (`POST /auth/register`)
- [ ] **View availability calendar**: Build calendar from booking data

### Customers

- [ ] **Login/logout**: Authentication system (`POST /auth/login`)
- [ ] **Create bookings**: Booking flow (`POST /holidaze/bookings`)
- [ ] **View bookings**: Personal booking list (`GET /holidaze/profiles/<name>/bookings?_venue=true`)
- [ ] **Update avatar**: Profile management (`PUT /holidaze/profiles/<name>`)

### Venue Managers

- [ ] **Login/logout**: Authentication with role checking
- [ ] **Create venues**: Venue creation form (`POST /holidaze/venues`)
- [ ] **Edit venues**: Venue management (`PUT /holidaze/venues/<id>`)
- [ ] **Delete venues**: Venue deletion (`DELETE /holidaze/venues/<id>`)
- [ ] **View venue bookings**: Booking management (`GET /holidaze/venues/<id>?_bookings=true`)
- [ ] **Update avatar**: Profile management (`PUT /holidaze/profiles/<name>`)

## API Response Handling

### Error Handling

- **400 Bad Request**: Form validation errors
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server issues

### Success Responses

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests

### Pagination Structure

```typescript
interface PaginationMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}
```

## Performance & Accessibility

### Performance Targets

- Lighthouse score > 90
- Fast initial page load
- Optimized image loading
- Efficient API calls with proper caching
- Code splitting for different user roles

### Accessibility Requirements

- WAVE compliance testing
- Keyboard navigation support
- Screen reader compatibility
- Proper color contrast ratios
- Alt text for all images
- Semantic HTML structure

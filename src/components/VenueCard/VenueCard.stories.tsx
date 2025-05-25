import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { VenueCard } from './VenueCard';
import type { Venue } from '../types';

// Mock venue data for stories
const mockVenue: Venue = {
  id: '1',
  name: 'Cozy Beach House',
  description: 'A beautiful house by the beach with stunning ocean views and modern amenities.',
  media: [
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Beach house exterior' }
  ],
  price: 150,
  maxGuests: 6,
  rating: 4.5,
  created: '2024-01-01',
  updated: '2024-01-01',
  meta: {
    wifi: true,
    parking: true,
    breakfast: false,
    pets: true
  },
  location: {
    address: '123 Beach Road',
    city: 'Coastal City',
    zip: '12345',
    country: 'Norway',
    continent: 'Europe',
    lat: 60.0,
    lng: 10.0
  },
  owner: {
    name: 'john_doe',
    email: 'john@stud.noroff.no',
    avatar: { url: '', alt: '' },
    banner: { url: '', alt: '' },
    venueManager: true
  },
  bookings: [],
  _count: { bookings: 3 }
};

const meta: Meta<typeof VenueCard> = {
  title: 'Components/VenueCard',
  component: VenueCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component for displaying venue information including image, title, location, price, and amenities.'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ maxWidth: '320px' }}>
          <Story />
        </div>
      </BrowserRouter>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    venue: mockVenue
  }
};

export const WithoutImage: Story = {
  args: {
    venue: {
      ...mockVenue,
      media: []
    }
  }
};

export const LowRating: Story = {
  args: {
    venue: {
      ...mockVenue,
      name: 'Budget Accommodation',
      rating: 2.5,
      price: 50
    }
  }
};

export const HighPrice: Story = {
  args: {
    venue: {
      ...mockVenue,
      name: 'Luxury Villa',
      rating: 5.0,
      price: 500,
      media: [
        { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Luxury villa' }
      ]
    }
  }
};

export const NoAmenities: Story = {
  args: {
    venue: {
      ...mockVenue,
      name: 'Basic Room',
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false
      }
    }
  }
};

export const LongName: Story = {
  args: {
    venue: {
      ...mockVenue,
      name: 'Exceptionally Beautiful Oceanfront Villa with Spectacular Views and Premium Amenities'
    }
  }
};
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BrowserRouter } from 'react-router-dom';
import BookingCard from './BookingCard';
import type { Booking } from '../types';

// Mock booking data for stories
const mockBooking: Booking = {
  id: '1',
  dateFrom: '2024-07-15',
  dateTo: '2024-07-22',
  guests: 4,
  created: '2024-06-01',
  updated: '2024-06-01',
  venue: {
    id: 'venue-1',
    name: 'Seaside Villa',
    description: 'Beautiful villa by the sea',
    media: [
      { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Seaside villa' }
    ],
    price: 200,
    maxGuests: 8,
    rating: 4.8,
    created: '2024-01-01',
    updated: '2024-01-01',
    meta: {
      wifi: true,
      parking: true,
      breakfast: true,
      pets: false
    },
    location: {
      address: '456 Ocean Drive',
      city: 'Coastal Town',
      zip: '54321',
      country: 'Norway',
      continent: 'Europe',
      lat: 59.0,
      lng: 11.0
    }
  }
};

const pastBooking: Booking = {
  ...mockBooking,
  id: '2',
  dateFrom: '2024-01-15',
  dateTo: '2024-01-22'
};

const meta: Meta<typeof BookingCard> = {
  title: 'Components/BookingCard',
  component: BookingCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component for displaying booking information including venue details, dates, and management options.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onDelete: {
      action: 'delete booking',
      description: 'Callback function when booking is deleted'
    }
  },
  args: {
    onDelete: fn()
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ maxWidth: '600px' }}>
          <Story />
        </div>
      </BrowserRouter>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UpcomingBooking: Story = {
  args: {
    booking: mockBooking
  }
};

export const PastBooking: Story = {
  args: {
    booking: pastBooking
  }
};

export const WithoutVenue: Story = {
  args: {
    booking: {
      ...mockBooking,
      venue: undefined
    }
  }
};

export const SingleNight: Story = {
  args: {
    booking: {
      ...mockBooking,
      dateFrom: '2024-07-15',
      dateTo: '2024-07-16',
      guests: 2
    }
  }
};

export const LongStay: Story = {
  args: {
    booking: {
      ...mockBooking,
      dateFrom: '2024-07-01',
      dateTo: '2024-07-31',
      guests: 6
    }
  }
};

export const WithoutDeleteFunction: Story = {
  args: {
    booking: mockBooking,
    onDelete: undefined
  }
};
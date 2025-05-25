import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { VenueCard } from '../../VenueCard';
import { Venue } from '../../../types/api';

const mockVenue: Venue = {
  id: '1',
  name: 'Cozy Beach House',
  description: 'A beautiful house by the beach with stunning ocean views',
  media: [
    { url: 'https://example.com/beach-house.jpg', alt: 'Beach house exterior' }
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
    banner: { url: '', alt: '' }
  },
  bookings: [],
  _count: { bookings: 3 }
};

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('VenueCard', () => {
  it('should render venue information correctly', () => {
    renderWithRouter(<VenueCard venue={mockVenue} />);

    expect(screen.getByText('Cozy Beach House')).toBeInTheDocument();
    expect(screen.getByText('Coastal City, Norway')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
    expect(screen.getByText('per night')).toBeInTheDocument();
    expect(screen.getByText('6 guests')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('should display venue image with correct alt text', () => {
    renderWithRouter(<VenueCard venue={mockVenue} />);

    const image = screen.getByAltText('Beach house exterior');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/beach-house.jpg');
  });

  it('should display placeholder image when no media provided', () => {
    const venueWithoutMedia = { ...mockVenue, media: [] };
    renderWithRouter(<VenueCard venue={venueWithoutMedia} />);

    const image = screen.getByAltText('Cozy Beach House');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });

  it('should display amenities correctly', () => {
    renderWithRouter(<VenueCard venue={mockVenue} />);

    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Pets')).toBeInTheDocument();
    expect(screen.queryByText('Breakfast')).not.toBeInTheDocument(); // Should not show false amenities
  });

  it('should not display amenities section when no amenities are available', () => {
    const venueWithoutAmenities = {
      ...mockVenue,
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false
      }
    };
    renderWithRouter(<VenueCard venue={venueWithoutAmenities} />);

    expect(screen.queryByText('WiFi')).not.toBeInTheDocument();
    expect(screen.queryByText('Parking')).not.toBeInTheDocument();
    expect(screen.queryByText('Breakfast')).not.toBeInTheDocument();
    expect(screen.queryByText('Pets')).not.toBeInTheDocument();
  });

  it('should display rating with stars', () => {
    renderWithRouter(<VenueCard venue={mockVenue} />);

    const ratingSection = screen.getByText('4.5').closest('div');
    expect(ratingSection).toBeInTheDocument();
    
    // Check for star icon (should be present in the rating display)
    const starIcon = ratingSection?.querySelector('svg');
    expect(starIcon).toBeInTheDocument();
  });

  it('should handle zero rating correctly', () => {
    const venueWithZeroRating = { ...mockVenue, rating: 0 };
    renderWithRouter(<VenueCard venue={venueWithZeroRating} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should link to venue details page', () => {
    renderWithRouter(<VenueCard venue={mockVenue} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/venues/1');
  });

  it('should display location correctly when city and country are available', () => {
    renderWithRouter(<VenueCard venue={mockVenue} />);

    expect(screen.getByText('Coastal City, Norway')).toBeInTheDocument();
  });

  it('should display only country when city is not available', () => {
    const venueWithoutCity = {
      ...mockVenue,
      location: { ...mockVenue.location, city: '' }
    };
    renderWithRouter(<VenueCard venue={venueWithoutCity} />);

    expect(screen.getByText('Norway')).toBeInTheDocument();
  });

  it('should display only city when country is not available', () => {
    const venueWithoutCountry = {
      ...mockVenue,
      location: { ...mockVenue.location, country: '' }
    };
    renderWithRouter(<VenueCard venue={venueWithoutCountry} />);

    expect(screen.getByText('Coastal City')).toBeInTheDocument();
  });

  it('should handle missing location gracefully', () => {
    const venueWithoutLocation = {
      ...mockVenue,
      location: {
        ...mockVenue.location,
        city: '',
        country: ''
      }
    };
    renderWithRouter(<VenueCard venue={venueWithoutLocation} />);

    // Should not display empty location text
    expect(screen.queryByText(', ')).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithRouter(<VenueCard venue={mockVenue} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', expect.stringContaining('Cozy Beach House'));
  });

  it('should handle long venue names correctly', () => {
    const venueWithLongName = {
      ...mockVenue,
      name: 'This is a very long venue name that should be handled properly by the component'
    };
    renderWithRouter(<VenueCard venue={venueWithLongName} />);

    expect(screen.getByText('This is a very long venue name that should be handled properly by the component')).toBeInTheDocument();
  });

  it('should handle decimal prices correctly', () => {
    const venueWithDecimalPrice = { ...mockVenue, price: 99.99 };
    renderWithRouter(<VenueCard venue={venueWithDecimalPrice} />);

    expect(screen.getByText('$100')).toBeInTheDocument(); // Should round to nearest dollar
  });

  it('should display guest capacity correctly', () => {
    renderWithRouter(<VenueCard venue={mockVenue} />);

    const guestInfo = screen.getByText('6 guests');
    expect(guestInfo).toBeInTheDocument();
  });

  it('should handle single guest capacity', () => {
    const venueWithOneGuest = { ...mockVenue, maxGuests: 1 };
    renderWithRouter(<VenueCard venue={venueWithOneGuest} />);

    expect(screen.getByText('1 guest')).toBeInTheDocument();
  });
});
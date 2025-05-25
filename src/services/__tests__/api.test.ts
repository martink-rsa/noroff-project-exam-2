import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from '../index';
import { ApiError } from '../../types/api';

// Mock fetch globally
(globalThis as any).fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Authentication', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        data: {
          name: 'test_user',
          email: 'test@stud.noroff.no',
          accessToken: 'mock-token',
          avatar: { url: '', alt: '' },
          banner: { url: '', alt: '' },
          venueManager: false
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.login({
        email: 'test@stud.noroff.no',
        password: 'password123'
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://v2.api.noroff.dev/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@stud.noroff.no',
            password: 'password123'
          })
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle login errors properly', async () => {
      const mockErrorResponse = {
        errors: [{ message: 'Invalid credentials' }]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockErrorResponse
      });

      await expect(apiService.login({
        email: 'invalid@stud.noroff.no',
        password: 'wrongpassword'
      })).rejects.toThrow(ApiError);
    });

    it('should register successfully with valid data', async () => {
      const mockResponse = {
        data: {
          name: 'new_user',
          email: 'new@stud.noroff.no',
          avatar: { url: '', alt: '' },
          banner: { url: '', alt: '' },
          venueManager: false
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.register({
        name: 'new_user',
        email: 'new@stud.noroff.no',
        password: 'password123',
        venueManager: false
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://v2.api.noroff.dev/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'new_user',
            email: 'new@stud.noroff.no',
            password: 'password123',
            venueManager: false
          })
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Venues', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'mock-token');
    });

    it('should fetch venues with default options', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            name: 'Test Venue',
            description: 'A test venue',
            media: [],
            price: 100,
            maxGuests: 4,
            rating: 4.5,
            created: '2024-01-01',
            updated: '2024-01-01',
            meta: {
              wifi: true,
              parking: false,
              breakfast: true,
              pets: false
            },
            location: {
              address: 'Test Address',
              city: 'Test City',
              zip: '12345',
              country: 'Test Country',
              continent: 'Test Continent',
              lat: 0,
              lng: 0
            },
            owner: {
              name: 'owner',
              email: 'owner@stud.noroff.no',
              avatar: { url: '', alt: '' },
              banner: { url: '', alt: '' }
            },
            bookings: [],
            _count: { bookings: 0 }
          }
        ],
        meta: {
          isFirstPage: true,
          isLastPage: true,
          currentPage: 1,
          previousPage: null,
          nextPage: null,
          pageCount: 1,
          totalCount: 1
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.getVenues();

      expect(fetch).toHaveBeenCalledWith(
        'https://v2.api.noroff.dev/holidaze/venues?_owner=true&_bookings=true',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
            'X-Noroff-API-Key': expect.any(String)
          }
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should create venue successfully', async () => {
      const venueData = {
        name: 'New Venue',
        description: 'A new venue',
        media: [{ url: 'http://example.com/image.jpg', alt: 'venue image' }],
        price: 150,
        maxGuests: 6,
        rating: 0,
        meta: {
          wifi: true,
          parking: true,
          breakfast: false,
          pets: true
        },
        location: {
          address: 'New Address',
          city: 'New City',
          zip: '54321',
          country: 'New Country',
          continent: 'New Continent',
          lat: 10.5,
          lng: 20.5
        }
      };

      const mockResponse = { data: { id: '123', ...venueData } };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.createVenue(venueData);

      expect(fetch).toHaveBeenCalledWith(
        'https://v2.api.noroff.dev/holidaze/venues',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
            'X-Noroff-API-Key': expect.any(String)
          },
          body: JSON.stringify(venueData)
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Bookings', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'mock-token');
    });

    it('should create booking successfully', async () => {
      const bookingData = {
        dateFrom: '2024-06-01',
        dateTo: '2024-06-07',
        guests: 2,
        venueId: 'venue-123'
      };

      const mockResponse = {
        data: {
          id: 'booking-123',
          ...bookingData,
          created: '2024-01-01',
          updated: '2024-01-01',
          customer: {
            name: 'customer',
            email: 'customer@stud.noroff.no',
            avatar: { url: '', alt: '' },
            banner: { url: '', alt: '' }
          }
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.createBooking(bookingData);

      expect(fetch).toHaveBeenCalledWith(
        'https://v2.api.noroff.dev/holidaze/bookings',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
            'X-Noroff-API-Key': expect.any(String)
          },
          body: JSON.stringify(bookingData)
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should fetch user bookings successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 'booking-1',
            dateFrom: '2024-06-01',
            dateTo: '2024-06-07',
            guests: 2,
            created: '2024-01-01',
            updated: '2024-01-01',
            venue: {
              id: 'venue-1',
              name: 'Test Venue',
              description: 'Test venue',
              media: [],
              price: 100,
              maxGuests: 4,
              rating: 4.5,
              created: '2024-01-01',
              updated: '2024-01-01',
              meta: {
                wifi: true,
                parking: false,
                breakfast: true,
                pets: false
              },
              location: {
                address: 'Test Address',
                city: 'Test City',
                zip: '12345',
                country: 'Test Country',
                continent: 'Test Continent',
                lat: 0,
                lng: 0
              }
            }
          }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiService.getProfileBookings('test_user');

      expect(fetch).toHaveBeenCalledWith(
        'https://v2.api.noroff.dev/holidaze/profiles/test_user/bookings?_venue=true',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
            'X-Noroff-API-Key': expect.any(String)
          }
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.getVenues()).rejects.toThrow('Network error');
    });

    it('should handle API errors with proper error messages', async () => {
      const mockErrorResponse = {
        errors: [
          { message: 'Validation failed' },
          { message: 'Invalid email format' }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse
      });

      try {
        await apiService.getVenues();
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Validation failed, Invalid email format');
        expect((error as ApiError).statusCode).toBe(400);
      }
    });
  });
});
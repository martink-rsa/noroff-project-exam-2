import type {
  ApiResponse,
  AuthResponse,
  Profile,
  Venue,
  Booking,
  RegisterData,
  LoginData,
  VenueData,
  BookingData,
  ProfileUpdateData
} from '../types';
import { ApiError } from '../types';

const API_BASE_URL = 'https://v2.api.noroff.dev';
const API_HOLIDAZE_URL = `${API_BASE_URL}/holidaze`;
const API_AUTH_URL = `${API_BASE_URL}/auth`;

class ApiService {
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.accessToken && !url.includes('/auth/')) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.accessToken}`,
        'X-Noroff-API-Key': import.meta.env.VITE_API_KEY || '',
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          errorData.errors?.[0]?.message || 'An error occurred',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred', 500);
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  clearAccessToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(`${API_AUTH_URL}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>(
      `${API_AUTH_URL}/login?_holidaze=true`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    
    this.setAccessToken(response.data.accessToken);
    return response;
  }

  async logout(): Promise<void> {
    this.clearAccessToken();
  }

  // Venue endpoints
  async getVenues(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<Venue[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    
    searchParams.set('_owner', 'true');
    searchParams.set('_bookings', 'true');

    return this.makeRequest<ApiResponse<Venue[]>>(
      `${API_HOLIDAZE_URL}/venues?${searchParams}`
    );
  }

  async getVenue(id: string): Promise<ApiResponse<Venue>> {
    return this.makeRequest<ApiResponse<Venue>>(
      `${API_HOLIDAZE_URL}/venues/${id}?_owner=true&_bookings=true`
    );
  }

  async searchVenues(query: string): Promise<ApiResponse<Venue[]>> {
    return this.makeRequest<ApiResponse<Venue[]>>(
      `${API_HOLIDAZE_URL}/venues/search?q=${encodeURIComponent(query)}&_owner=true&_bookings=true`
    );
  }

  async createVenue(data: VenueData): Promise<ApiResponse<Venue>> {
    return this.makeRequest<ApiResponse<Venue>>(
      `${API_HOLIDAZE_URL}/venues`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async updateVenue(id: string, data: Partial<VenueData>): Promise<ApiResponse<Venue>> {
    return this.makeRequest<ApiResponse<Venue>>(
      `${API_HOLIDAZE_URL}/venues/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteVenue(id: string): Promise<void> {
    await this.makeRequest<void>(`${API_HOLIDAZE_URL}/venues/${id}`, {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    return this.makeRequest<ApiResponse<Booking[]>>(
      `${API_HOLIDAZE_URL}/bookings?_customer=true&_venue=true`
    );
  }

  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.makeRequest<ApiResponse<Booking>>(
      `${API_HOLIDAZE_URL}/bookings/${id}?_customer=true&_venue=true`
    );
  }

  async createBooking(data: BookingData): Promise<ApiResponse<Booking>> {
    return this.makeRequest<ApiResponse<Booking>>(
      `${API_HOLIDAZE_URL}/bookings`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async updateBooking(id: string, data: Partial<BookingData>): Promise<ApiResponse<Booking>> {
    return this.makeRequest<ApiResponse<Booking>>(
      `${API_HOLIDAZE_URL}/bookings/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteBooking(id: string): Promise<void> {
    await this.makeRequest<void>(`${API_HOLIDAZE_URL}/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Profile endpoints
  async getProfile(name: string): Promise<ApiResponse<Profile>> {
    return this.makeRequest<ApiResponse<Profile>>(
      `${API_HOLIDAZE_URL}/profiles/${name}?_bookings=true&_venues=true`
    );
  }

  async updateProfile(name: string, data: ProfileUpdateData): Promise<ApiResponse<Profile>> {
    return this.makeRequest<ApiResponse<Profile>>(
      `${API_HOLIDAZE_URL}/profiles/${name}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async getProfileBookings(name: string): Promise<ApiResponse<Booking[]>> {
    return this.makeRequest<ApiResponse<Booking[]>>(
      `${API_HOLIDAZE_URL}/profiles/${name}/bookings?_venue=true`
    );
  }

  async getProfileVenues(name: string): Promise<ApiResponse<Venue[]>> {
    return this.makeRequest<ApiResponse<Venue[]>>(
      `${API_HOLIDAZE_URL}/profiles/${name}/venues?_bookings=true`
    );
  }
}

export const apiService = new ApiService();
export default apiService;
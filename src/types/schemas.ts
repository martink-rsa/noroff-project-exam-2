import { z } from 'zod';

const imageSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  alt: z.string().max(120, 'Alt text must be less than 120 characters').optional(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Name can only contain letters, numbers, and underscores'
    ),
  email: z
    .string()
    .email('Invalid email format')
    .endsWith('@stud.noroff.no', 'Email must be from stud.noroff.no domain'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  venueManager: z.boolean().optional().default(false),
  avatar: imageSchema.optional(),
  banner: imageSchema.optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  maxGuests: z.number().min(1, 'Must allow at least 1 guest'),
  media: z.array(imageSchema).optional(),
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

export const bookingSchema = z
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

export const profileUpdateSchema = z.object({
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  avatar: imageSchema.optional(),
  banner: imageSchema.optional(),
  venueManager: z.boolean().optional(),
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type VenueData = z.infer<typeof venueSchema>;
export type BookingData = z.infer<typeof bookingSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
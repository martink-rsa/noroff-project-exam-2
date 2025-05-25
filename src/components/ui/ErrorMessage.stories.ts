import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ErrorMessage } from './ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'UI/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An error message component that displays error information with optional retry functionality.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the error message'
    },
    message: {
      control: 'text',
      description: 'The error message content'
    },
    onRetry: {
      action: 'retry clicked',
      description: 'Callback function when retry button is clicked'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply'
    }
  },
  args: {
    onRetry: fn()
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Something went wrong. Please try again.'
  }
};

export const WithCustomTitle: Story = {
  args: {
    title: 'Network Error',
    message: 'Unable to connect to the server. Please check your internet connection.'
  }
};

export const WithRetryButton: Story = {
  args: {
    title: 'Failed to Load',
    message: 'There was an error loading the data. You can try again.',
    onRetry: fn()
  }
};

export const WithoutRetry: Story = {
  args: {
    title: 'Access Denied',
    message: 'You do not have permission to view this content.',
    onRetry: undefined
  }
};

export const LongMessage: Story = {
  args: {
    title: 'Validation Error',
    message: 'The form contains several validation errors: Email address is required and must be valid, password must be at least 8 characters long and contain at least one number, and the terms of service must be accepted.'
  }
};
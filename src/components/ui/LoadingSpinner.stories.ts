import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable loading spinner component with different sizes.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the loading spinner'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'small'
  }
};

export const Medium: Story = {
  args: {
    size: 'medium'
  }
};

export const Large: Story = {
  args: {
    size: 'large'
  }
};

export const WithCustomClass: Story = {
  args: {
    size: 'medium',
    className: 'border-red-600'
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading spinner with custom border color using Tailwind classes.'
      }
    }
  }
};
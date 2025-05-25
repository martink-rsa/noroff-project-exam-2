import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A search bar component for finding venues with customizable placeholder text and search functionality.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSearch: {
      action: 'search performed',
      description: 'Callback function when search is performed'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply'
    }
  },
  args: {
    onSearch: fn()
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const WithCustomPlaceholder: Story = {
  args: {
    placeholder: 'Find your perfect vacation rental...'
  }
};

export const WithShortPlaceholder: Story = {
  args: {
    placeholder: 'Search...'
  }
};

export const CustomStyling: Story = {
  args: {
    placeholder: 'Search with custom styling',
    className: 'max-w-md'
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchBar with custom maximum width applied via className prop.'
      }
    }
  }
};
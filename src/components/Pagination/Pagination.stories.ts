import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A pagination component for navigating through multiple pages of content.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'The currently active page number'
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages available'
    },
    onPageChange: {
      action: 'page changed',
      description: 'Callback function when page is changed'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply'
    }
  },
  args: {
    onPageChange: fn()
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10
  }
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10
  }
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10
  }
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3
  }
};

export const ManyPages: Story = {
  args: {
    currentPage: 15,
    totalPages: 50
  }
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1
  },
  parameters: {
    docs: {
      description: {
        story: 'When there is only one page, the pagination component does not render anything.'
      }
    }
  }
};
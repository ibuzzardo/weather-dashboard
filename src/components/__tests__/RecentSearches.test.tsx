import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecentSearches from '../RecentSearches';
import type { GeoResult } from '@/lib/types';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('RecentSearches', () => {
  const mockOnCitySelect = jest.fn();
  
  const mockRecentSearches: GeoResult[] = [
    {
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      country: 'United Kingdom',
      admin1: 'England'
    },
    {
      name: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      country: 'France'
    },
    {
      name: 'Tokyo',
      latitude: 35.6762,
      longitude: 139.6503,
      country: 'Japan'
    }
  ];

  beforeEach(() => {
    mockOnCitySelect.mockClear();
    mockOnCitySelect.mockResolvedValue(undefined);
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  it('should render nothing when no recent searches exist', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { container } = render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should render recent searches when they exist', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRecentSearches));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    expect(screen.getByText('Recent Searches')).toBeInTheDocument();
    expect(screen.getByText('London, England')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
  });

  it('should handle cities without admin1', () => {
    const citiesWithoutAdmin1 = mockRecentSearches.filter(city => !city.admin1);
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(citiesWithoutAdmin1));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(screen.queryByText('Paris,')).not.toBeInTheDocument();
  });

  it('should call onCitySelect when city button is clicked', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRecentSearches));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    const londonButton = screen.getByText('London, England');
    await user.click(londonButton);
    
    expect(mockOnCitySelect).toHaveBeenCalledWith(mockRecentSearches[0]);
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRecentSearches));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    const londonButton = screen.getByText('London, England');
    londonButton.focus();
    
    await user.keyboard('{Enter}');
    expect(mockOnCitySelect).toHaveBeenCalledWith(mockRecentSearches[0]);
    
    mockOnCitySelect.mockClear();
    
    await user.keyboard(' ');
    expect(mockOnCitySelect).toHaveBeenCalledWith(mockRecentSearches[0]);
  });

  it('should prevent default behavior for keyboard events', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRecentSearches));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    const londonButton = screen.getByText('London, England');
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    const preventDefaultSpy = jest.spyOn(enterEvent, 'preventDefault');
    
    fireEvent(londonButton, enterEvent);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should disable buttons when loading', async () => {
    const user = userEvent.setup();
    let resolveSelect: () => void;
    const selectPromise = new Promise<void>((resolve) => {
      resolveSelect = resolve;
    });
    mockOnCitySelect.mockReturnValue(selectPromise);
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRecentSearches));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    const londonButton = screen.getByText('London, England');
    await user.click(londonButton);
    
    // All buttons should be disabled during loading
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    // Resolve the promise
    resolveSelect!();
    await waitFor(() => {
      buttons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  it('should handle localStorage parsing errors', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { container } = render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    expect(container.firstChild).toBeEmptyDOMElement();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to parse recent searches:', expect.any(SyntaxError));
    
    consoleSpy.mockRestore();
  });

  it('should handle empty localStorage gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('');
    
    const { container } = render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should apply correct CSS classes', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRecentSearches));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    const title = screen.getByText('Recent Searches');
    expect(title).toHaveClass('text-sm', 'font-medium', 'text-secondary', 'mb-2');
    
    const container = title.parentElement;
    expect(container).toHaveClass('w-full');
    
    const buttonsContainer = screen.getByText('London, England').parentElement;
    expect(buttonsContainer).toHaveClass('flex', 'flex-wrap', 'gap-2');
    
    const button = screen.getByText('London, England');
    expect(button).toHaveClass(
      'px-3',
      'py-1',
      'bg-gray-100',
      'hover:bg-gray-200',
      'text-gray-700',
      'text-sm',
      'rounded-full',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary/50'
    );
  });

  it('should handle onCitySelect errors gracefully', async () => {
    const user = userEvent.setup();
    mockOnCitySelect.mockRejectedValue(new Error('Network error'));
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRecentSearches));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    const londonButton = screen.getByText('London, England');
    await user.click(londonButton);
    
    // Should not crash and buttons should be re-enabled
    await waitFor(() => {
      expect(londonButton).not.toBeDisabled();
    });
  });

  it('should generate unique keys for buttons', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockRecentSearches));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    
    // Each button should have unique content
    const buttonTexts = buttons.map(button => button.textContent);
    const uniqueTexts = new Set(buttonTexts);
    expect(uniqueTexts.size).toBe(buttonTexts.length);
  });

  it('should handle cities with same coordinates but different names', () => {
    const duplicateCoordsCities = [
      mockRecentSearches[0],
      { ...mockRecentSearches[0], name: 'Greater London' }
    ];
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(duplicateCoordsCities));
    
    render(<RecentSearches onCitySelect={mockOnCitySelect} />);
    
    expect(screen.getByText('London, England')).toBeInTheDocument();
    expect(screen.getByText('Greater London, England')).toBeInTheDocument();
  });
});
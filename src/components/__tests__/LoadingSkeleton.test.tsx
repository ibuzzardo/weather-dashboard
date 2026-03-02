import { render, screen } from '@testing-library/react';
import LoadingSkeleton from '../LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('should render loading skeleton with correct structure', () => {
    render(<LoadingSkeleton />);
    
    // Check main container
    const container = screen.getByRole('status', { hidden: true }) || document.querySelector('.animate-pulse');
    expect(container).toBeInTheDocument();
  });

  it('should have animate-pulse class for animation', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const skeletonContainer = container.querySelector('.animate-pulse');
    expect(skeletonContainer).toBeInTheDocument();
    expect(skeletonContainer).toHaveClass('w-full', 'max-w-4xl', 'space-y-6', 'animate-pulse');
  });

  it('should render current weather skeleton section', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const currentWeatherSkeleton = container.querySelector('.bg-gradient-to-br.from-blue-400.to-blue-600');
    expect(currentWeatherSkeleton).toBeInTheDocument();
    expect(currentWeatherSkeleton).toHaveClass('rounded-lg', 'p-8', 'text-white');
  });

  it('should render correct number of skeleton elements in current weather', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // Should have skeleton elements with white/20 opacity backgrounds
    const skeletonElements = container.querySelectorAll('.bg-white\/20');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should render forecast skeleton cards', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // Should render 5 forecast skeleton cards
    const forecastSkeletons = container.querySelectorAll('.bg-foreground.shadow-md.rounded-lg.p-4');
    expect(forecastSkeletons).toHaveLength(5);
  });

  it('should have responsive grid layout for forecast', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const forecastGrid = container.querySelector('.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-5');
    expect(forecastGrid).toBeInTheDocument();
    expect(forecastGrid).toHaveClass('gap-4');
  });

  it('should render skeleton elements with correct sizes', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // Check for different height classes in current weather section
    expect(container.querySelector('.h-8')).toBeInTheDocument();
    expect(container.querySelector('.h-16')).toBeInTheDocument();
    expect(container.querySelector('.h-6')).toBeInTheDocument();
  });

  it('should render skeleton elements with correct widths', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // Check for different width classes
    expect(container.querySelector('.w-3\/4')).toBeInTheDocument();
    expect(container.querySelector('.w-1\/2')).toBeInTheDocument();
    expect(container.querySelector('.w-2\/3')).toBeInTheDocument();
    expect(container.querySelector('.w-full')).toBeInTheDocument();
  });

  it('should have proper spacing between sections', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const mainContainer = container.querySelector('.space-y-6');
    expect(mainContainer).toBeInTheDocument();
  });

  it('should render forecast skeleton cards with proper structure', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const forecastCards = container.querySelectorAll('.bg-foreground.shadow-md.rounded-lg.p-4');
    
    forecastCards.forEach(card => {
      expect(card).toHaveClass('space-y-3');
      
      // Each card should have skeleton elements
      const skeletonElements = card.querySelectorAll('.bg-gray-200');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  it('should have centered elements in forecast cards', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const centeredElements = container.querySelectorAll('.mx-auto');
    expect(centeredElements.length).toBeGreaterThan(0);
  });

  it('should render with consistent styling', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // All skeleton elements should have rounded corners
    const roundedElements = container.querySelectorAll('.rounded, .rounded-lg');
    expect(roundedElements.length).toBeGreaterThan(0);
  });

  it('should be responsive', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // Check for responsive classes
    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
    expect(container.querySelector('.md\\:grid-cols-5')).toBeInTheDocument();
    expect(container.querySelector('.sm\\:grid-cols-3')).toBeInTheDocument();
  });

  it('should maintain proper aspect ratios', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // Check for specific height classes that maintain proportions
    expect(container.querySelector('.h-12')).toBeInTheDocument(); // Icon placeholder
    expect(container.querySelector('.h-4')).toBeInTheDocument();  // Text placeholders
    expect(container.querySelector('.h-5')).toBeInTheDocument();  // Title placeholders
  });

  it('should not contain any actual text content', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // Should not contain any meaningful text, only skeleton shapes
    expect(container.textContent?.trim()).toBe('');
  });

  it('should render consistently on multiple renders', () => {
    const { container: container1 } = render(<LoadingSkeleton />);
    const { container: container2 } = render(<LoadingSkeleton />);
    
    // Both should have the same structure
    const skeletons1 = container1.querySelectorAll('.animate-pulse');
    const skeletons2 = container2.querySelectorAll('.animate-pulse');
    
    expect(skeletons1).toHaveLength(skeletons2.length);
  });
});
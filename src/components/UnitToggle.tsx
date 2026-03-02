'use client';

interface UnitToggleProps {
  unit: 'celsius' | 'fahrenheit';
  onToggle: () => void;
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps): JSX.Element {
  return (
    <button
      onClick={onToggle}
      className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors"
      type="button"
    >
      °{unit === 'celsius' ? 'C' : 'F'}
    </button>
  );
}
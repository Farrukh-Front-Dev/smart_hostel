import { Search, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { FloorFilter } from '../types';

interface PeersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  floorFilter: FloorFilter;
  onFloorChange: (value: FloorFilter) => void;
  onAddClick: () => void;
  searchPlaceholder?: string;
  addButtonLabel?: string;
  allFloorsLabel?: string;
}

export default function PeersFilters({
  searchQuery,
  onSearchChange,
  floorFilter,
  onFloorChange,
  onAddClick,
  searchPlaceholder = 'Qidirish',
  addButtonLabel = 'Qo\'shish',
  allFloorsLabel = 'Barcha qavatlar',
}: PeersFiltersProps) {
  const floorButtons = [
    { value: 'all' as const, label: allFloorsLabel },
    { value: 1, label: '1-qavat' },
    { value: 2, label: '2-qavat' },
    { value: 3, label: '3-qavat' },
    { value: 4, label: '4-qavat' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-gray-900 shadow-3d-md">
      <div className="space-y-4">
        {/* Search and Add Button */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium"
            />
          </div>
          <Button onClick={onAddClick} variant="primary" size="md">
            <Plus size={18} />
            <span className="hidden sm:inline">{addButtonLabel}</span>
          </Button>
        </div>

        {/* Floor Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {floorButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onFloorChange(btn.value)}
              className={`px-4 py-2 rounded-lg font-medium border-2 transition-all text-sm ${
                floorFilter === btn.value
                  ? 'bg-gradient-primary text-white border-gray-900 shadow-3d-sm'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Search, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { FloorFilter, StatusFilter } from '../types';
import { Language, getTranslation } from '@/lib/i18n';

interface PeersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  floorFilter: FloorFilter;
  onFloorChange: (value: FloorFilter) => void;
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  onAddClick: () => void;
  language: Language;
}

export default function PeersFilters({
  searchQuery,
  onSearchChange,
  floorFilter,
  onFloorChange,
  statusFilter,
  onStatusChange,
  onAddClick,
  language,
}: PeersFiltersProps) {
  const t = (key: string) => getTranslation(language, key as any);
  
  const floorButtons = [
    { value: 'all' as const, label: t('allFloors') },
    { value: 1, label: t('floor1') },
    { value: 2, label: t('floor2') },
    { value: 3, label: t('floor3') },
    { value: 4, label: t('floor4') },
  ];

  const statusButtons = [
    { value: 'active' as const, label: t('active') },
    { value: 'frozen' as const, label: t('frozen') },
  ];

  const handleStatusClick = (value: 'active' | 'frozen') => {
    // Toggle: agar allaqachon tanlangan bo'lsa, null qil (hammasi ko'rinsin)
    if (statusFilter === value) {
      onStatusChange(null);
    } else {
      onStatusChange(value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-gray-900 shadow-3d-md">
      <div className="space-y-4">
        {/* Search and Add Button */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-900 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-cyan transition-all font-medium"
            />
          </div>
          <Button onClick={onAddClick} variant="primary" size="md">
            <Plus size={18} />
            <span className="hidden sm:inline">{t('addStudent')}</span>
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

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {statusButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => handleStatusClick(btn.value)}
              className={`px-4 py-2 rounded-lg font-medium border-2 transition-all text-sm ${
                statusFilter === btn.value
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

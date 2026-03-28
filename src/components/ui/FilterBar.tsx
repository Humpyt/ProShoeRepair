import * as React from "react";
import { Search, Calendar, ChevronDown } from "lucide-react";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  onDateRangeChange?: (range: DateRange) => void;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
  showDateRange?: boolean;
  showCategory?: boolean;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = "Search...",
  onSearchChange,
  onDateRangeChange,
  onCategoryChange,
  categories = [],
  showDateRange = false,
  showCategory = false,
  className = "",
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [dateStart, setDateStart] = React.useState("");
  const [dateEnd, setDateEnd] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleDateStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateStart(value);
    if (onDateRangeChange) {
      const startDate = value ? new Date(value) : null;
      onDateRangeChange({ start: startDate, end: dateEnd ? new Date(dateEnd) : null });
    }
  };

  const handleDateEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateEnd(value);
    if (onDateRangeChange) {
      const endDate = value ? new Date(value) : null;
      onDateRangeChange({ start: dateStart ? new Date(dateStart) : null, end: endDate });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  return (
    <div className={`flex flex-wrap gap-4 items-center mb-6 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={18}
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full bg-gray-800 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Date Range Filters */}
      {showDateRange && (
        <>
          <div className="relative flex items-center gap-2">
            <Calendar className="absolute left-3 text-gray-500" size={18} />
            <input
              type="date"
              value={dateStart}
              onChange={handleDateStartChange}
              className="bg-gray-800 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative flex items-center gap-2">
            <Calendar className="absolute left-3 text-gray-500" size={18} />
            <input
              type="date"
              value={dateEnd}
              onChange={handleDateEndChange}
              className="bg-gray-800 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </>
      )}

      {/* Category Filter */}
      {showCategory && categories.length > 0 && (
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="bg-gray-800 border border-white/10 rounded-xl px-4 py-2 pl-10 text-white appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer min-w-[150px]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
          />
        </div>
      )}
    </div>
  );
};

FilterBar.displayName = "FilterBar";

export { FilterBar };
export type { FilterBarProps, DateRange };

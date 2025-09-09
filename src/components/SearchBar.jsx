import React, { useState, useEffect } from "react";
import Icon from "./Icon";

const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  className = "",
  showClearButton = true,
  size = "md",
  ...props
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name="search" className="h-5 w-5 text-gray-400" />
      </div>

      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`form-input pl-10 pr-10 ${sizeClasses[size]}`}
        aria-label={props['aria-label'] || `Search ${placeholder.toLowerCase()}`}
        {...props}
      />

      {showClearButton && localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

// Advanced search bar with filters
export const AdvancedSearchBar = ({
  value = "",
  onChange,
  onFilterChange,
  filters = [],
  placeholder = "Search...",
  className = "",
  ...props
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  const handleFilterChange = (filterKey, filterValue) => {
    onFilterChange(filterKey, filterValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <SearchBar
          value={localValue}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1"
          {...props}
        />

        {filters.length > 0 && (
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Icon name="filter" className="w-4 h-4" />
            Filters
          </button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-md space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="form-label">{filter.label}</label>
                {filter.type === "select" ? (
                  <select
                    value={filter.value || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    className="form-input"
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={filter.type || "text"}
                    value={filter.value || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    placeholder={filter.placeholder}
                    className="form-input"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

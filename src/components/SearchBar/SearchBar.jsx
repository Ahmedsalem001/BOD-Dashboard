import React, { memo } from "react";
import { debounce } from "../../utils/helpers";

const SearchBar = memo(({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  debounceMs = 300,
  ...props
}) => {
  const debouncedOnChange = React.useCallback(
    debounce((value) => onChange(value), debounceMs),
    [onChange, debounceMs]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    debouncedOnChange(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        className="form-input pl-10"
        placeholder={placeholder}
        onChange={handleChange}
        {...props}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

});

SearchBar.displayName = 'SearchBar';

export default SearchBar;

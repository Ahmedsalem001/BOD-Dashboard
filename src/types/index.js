// Type definitions and interfaces for the application
// Note: This is a JavaScript file, but we can add JSDoc comments for better type hints

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string} role - User role
 * @property {string} avatar - User avatar URL
 */

/**
 * @typedef {Object} Entry
 * @property {number} id - Entry ID
 * @property {string} title - Entry title
 * @property {string} body - Entry content
 * @property {number} userId - User ID who created the entry
 * @property {string} [createdAt] - Creation date
 * @property {string} [updatedAt] - Last update date
 * @property {string} [status] - Entry status
 * @property {number} [views] - Number of views
 * @property {number} [likes] - Number of likes
 * @property {string[]} [tags] - Entry tags
 * @property {string} [excerpt] - Entry excerpt
 * @property {Object} [author] - Author information
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user - Current user
 * @property {string|null} token - Auth token
 * @property {boolean} isAuthenticated - Authentication status
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message
 */

/**
 * @typedef {Object} EntriesState
 * @property {Entry[]} items - List of entries
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message
 * @property {string} searchTerm - Search term
 * @property {number} currentPage - Current page number
 * @property {number} itemsPerPage - Items per page
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Notification ID
 * @property {string} type - Notification type (success, error, warning, info)
 * @property {string} message - Notification message
 * @property {number} [duration] - Auto-dismiss duration in ms
 */

/**
 * @typedef {Object} TableColumn
 * @property {string} key - Column key
 * @property {string} title - Column title
 * @property {string} [headerClassName] - Header CSS classes
 * @property {string} [cellClassName] - Cell CSS classes
 * @property {boolean} [sortable] - Whether column is sortable
 * @property {Function} [onSort] - Sort handler
 * @property {Function} [render] - Custom render function
 */

/**
 * @typedef {Object} PaginationData
 * @property {Entry[]} entries - Paginated entries
 * @property {number} totalPages - Total number of pages
 * @property {number} totalItems - Total number of items
 */

/**
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - Button content
 * @property {string} [variant] - Button variant (primary, secondary, danger, success, outline)
 * @property {string} [size] - Button size (sm, md, lg)
 * @property {boolean} [disabled] - Whether button is disabled
 * @property {boolean} [loading] - Whether button is in loading state
 * @property {string} [type] - Button type
 * @property {string} [className] - Additional CSS classes
 * @property {Function} [onClick] - Click handler
 * @property {string} [aria-label] - ARIA label
 */

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Whether modal is open
 * @property {Function} onClose - Close handler
 * @property {string} [title] - Modal title
 * @property {React.ReactNode} children - Modal content
 * @property {string} [size] - Modal size (sm, md, lg, xl, full)
 * @property {boolean} [showCloseButton] - Whether to show close button
 * @property {boolean} [closeOnOverlayClick] - Whether to close on overlay click
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {Object} SearchBarProps
 * @property {string} [value] - Search value
 * @property {Function} onChange - Change handler
 * @property {string} [placeholder] - Placeholder text
 * @property {number} [debounceMs] - Debounce delay in ms
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [showClearButton] - Whether to show clear button
 * @property {string} [size] - Input size (sm, md, lg)
 * @property {string} [aria-label] - ARIA label
 */

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - Card title
 * @property {string|number} value - Card value
 * @property {React.ReactNode} icon - Card icon
 * @property {string} [iconColor] - Icon color theme
 * @property {string} [className] - Additional CSS classes
 */

/**
 * @typedef {Object} IconProps
 * @property {string} name - Icon name
 * @property {string} [className] - Icon CSS classes
 * @property {Object} [props] - Additional props
 */

// Export types for use in other files
export const TYPES = {
  USER: 'User',
  ENTRY: 'Entry',
  AUTH_STATE: 'AuthState',
  ENTRIES_STATE: 'EntriesState',
  NOTIFICATION: 'Notification',
  TABLE_COLUMN: 'TableColumn',
  PAGINATION_DATA: 'PaginationData',
  BUTTON_PROPS: 'ButtonProps',
  MODAL_PROPS: 'ModalProps',
  SEARCH_BAR_PROPS: 'SearchBarProps',
  STATS_CARD_PROPS: 'StatsCardProps',
  ICON_PROPS: 'IconProps',
};

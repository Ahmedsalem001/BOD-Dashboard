import { useState, useMemo } from 'react'

export const useTable = (data = [], options = {}) => {
  const {
    searchFields = ['title', 'body'],
    itemsPerPage: defaultItemsPerPage = 10,
    initialPage = 1
  } = options

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field]
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }, [data, searchTerm, searchFields])

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  // Calculate pagination info
  const paginationInfo = useMemo(() => ({
    currentPage,
    totalPages: Math.ceil(filteredData.length / itemsPerPage),
    totalItems: filteredData.length,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, filteredData.length)
  }), [currentPage, filteredData.length, itemsPerPage])

  // Reset to first page when search term changes
  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  // Reset to first page when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(parseInt(newItemsPerPage))
    setCurrentPage(1)
  }

  return {
    // Data
    data: paginatedData,
    filteredData,
    searchTerm,
    currentPage,
    itemsPerPage,
    
    // Pagination info
    ...paginationInfo,
    
    // Actions
    setSearchTerm: handleSearch,
    setCurrentPage,
    setItemsPerPage: handleItemsPerPageChange,
    
    // Utilities
    hasData: paginatedData.length > 0,
    hasNextPage: currentPage < paginationInfo.totalPages,
    hasPrevPage: currentPage > 1
  }
}

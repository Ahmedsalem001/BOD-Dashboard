import React from 'react'

export const LoadingSpinner = () => (
  <div className="card">
    <div className="card-body">
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="spinner"></div>
          <span className="text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    </div>
  </div>
)

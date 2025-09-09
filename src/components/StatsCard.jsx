import React, { memo } from 'react';
import PropTypes from 'prop-types';

const StatsCard = memo(({ 
  title, 
  value, 
  icon, 
  iconColor = 'primary', 
  className = '' 
}) => {
  const iconColorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${iconColorClasses[iconColor]}`}>
              {icon}
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  iconColor: PropTypes.oneOf(['primary', 'green', 'yellow', 'red', 'blue']),
  className: PropTypes.string,
};

export default StatsCard;

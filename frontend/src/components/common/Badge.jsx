const Badge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100/80 text-yellow-700 border-yellow-200/50';
      case 'approved':
      case 'present':
        return 'bg-green-100/80 text-green-700 border-green-200/50';
      case 'rejected':
      case 'absent':
        return 'bg-red-100/80 text-red-700 border-red-200/50';
      case 'late':
        return 'bg-orange-100/80 text-orange-700 border-orange-200/50';
      default:
        return 'bg-gray-100/80 text-gray-700 border-gray-200/50';
    }
  };

  return (
    <span 
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
        ${getStatusStyles(status)}
      `}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default Badge;

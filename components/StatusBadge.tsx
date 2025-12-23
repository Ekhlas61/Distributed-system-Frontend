
import React from 'react';
import { ReservationStatus } from '../types';

interface StatusBadgeProps {
  status: ReservationStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ReservationStatus.PAID:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ReservationStatus.CONFIRMED:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case ReservationStatus.NOTIFIED:
        return 'bg-green-100 text-green-800 border-green-200';
      case ReservationStatus.FAILED:
      case ReservationStatus.EXPIRED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()} uppercase tracking-tight`}>
      {status}
    </span>
  );
};

export default StatusBadge;

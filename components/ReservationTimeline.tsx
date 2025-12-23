
import React from 'react';
import { ReservationStatus } from '../types';

interface ReservationTimelineProps {
  status: ReservationStatus;
}

const ReservationTimeline: React.FC<ReservationTimelineProps> = ({ status }) => {
  const steps = [
    { label: 'Reserved', status: [ReservationStatus.PENDING, ReservationStatus.PAID, ReservationStatus.NOTIFIED, ReservationStatus.CONFIRMED], service: 'Reservation-Svc' },
    { label: 'Paid', status: [ReservationStatus.PAID, ReservationStatus.NOTIFIED, ReservationStatus.CONFIRMED], service: 'Payment-Svc' },
    { label: 'Notified', status: [ReservationStatus.NOTIFIED], service: 'Notify-Svc' },
  ];

  const currentStepIndex = steps.findIndex(step => step.status.includes(status));
  const isFailed = status === ReservationStatus.FAILED || status === ReservationStatus.EXPIRED;

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = steps.slice(0, idx + 1).some(s => s.status.includes(status));
          const isActive = idx === currentStepIndex && !isFailed;
          
          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-500 ${
                  isFailed && idx <= currentStepIndex ? 'bg-red-50 border-red-500 text-red-600' :
                  isCompleted ? 'bg-green-500 border-green-500 text-white shadow-lg' : 
                  isActive ? 'bg-white border-blue-500 text-blue-500 animate-pulse ring-4 ring-blue-50' : 
                  'bg-white border-gray-200 text-gray-300'
                }`}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                <p className="text-[8px] text-gray-400 font-mono mt-0.5">{step.service}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mb-6 relative">
                  <div className={`absolute left-0 top-0 h-full bg-green-500 transition-all duration-1000 ${
                    steps.slice(0, idx + 2).some(s => s.status.includes(status)) ? 'w-full' : 'w-0'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {isFailed && (
        <div className="mt-4 p-2 bg-red-50 rounded border border-red-100 text-center">
          <p className="text-xs font-medium text-red-600">Workflow interrupted or timed out.</p>
        </div>
      )}
    </div>
  );
};

export default ReservationTimeline;

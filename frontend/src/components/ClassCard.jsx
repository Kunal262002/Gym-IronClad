import React from 'react';

const ClassCard = ({ classItem, onBook, booking, onEdit }) => {
  const spotsLeft = classItem.capacity - classItem.spotsBooked;
  const isFull = spotsLeft <= 0;

  return (
    <div className="card flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
      <div className="sm:w-32 shrink-0">
        <p className="section-eyebrow mb-0">{classItem.dayOfWeek}</p>
        <p className="font-display text-3xl">{classItem.startTime}</p>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-xl mb-1">{classItem.title}</h3>
        <p className="text-sm text-chalk/60 mb-2">{classItem.description}</p>
        <p className="text-xs uppercase tracking-wide text-chalk/40">
          Coached by {classItem.trainer?.name || 'TBD'} · {classItem.durationMinutes} min
        </p>
      </div>
      <div className="sm:text-right shrink-0 w-full sm:w-auto">
        <p className={`text-xs uppercase font-bold mb-2 ${isFull ? 'text-rust' : 'text-volt'}`}>
          {isFull ? 'Full' : `${spotsLeft} spots left`}
        </p>
        <button
          onClick={() => onBook?.(classItem)}
          disabled={isFull || booking}
          className="btn-outline w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {booking ? 'Booking…' : 'Book Spot'}
        </button>
        {onEdit && <button type="button" onClick={() => onEdit(classItem)} className="btn-outline mt-3 w-full">Edit class</button>}
      </div>
    </div>
  );
};

export default ClassCard;

import React from 'react';

const TrainerCard = ({ trainer, onEdit }) => (
  <div className="card group">
    <div className="aspect-[4/5] bg-ink mb-5 overflow-hidden flex items-center justify-center">
      {trainer.photoUrl ? (
        <img
          src={trainer.photoUrl}
          alt={trainer.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <span className="font-display text-6xl text-white/10">
          {trainer.name?.charAt(0)}
        </span>
      )}
    </div>
    <p className="section-eyebrow">{trainer.specialty}</p>
    <h3 className="font-display text-2xl mb-2">{trainer.name}</h3>
    <p className="text-sm text-chalk/60 mb-3">{trainer.bio}</p>
    <p className="text-xs uppercase tracking-wide text-chalk/40">
      {trainer.experienceYears} years coaching
    </p>
    {onEdit && <button type="button" onClick={() => onEdit(trainer)} className="btn-outline w-full mt-5">Edit trainer</button>}
  </div>
);

export default TrainerCard;

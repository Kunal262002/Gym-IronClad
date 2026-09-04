import React from 'react';

const PlanCard = ({ plan, onSelect, actionLabel = 'Choose Plan', onEdit }) => (
  <div
    className={`card flex flex-col ${
      plan.isPopular ? 'border-volt relative' : ''
    }`}
  >
    {plan.isPopular && (
      <span className="absolute -top-3 left-6 bg-volt text-ink text-xs font-bold uppercase tracking-wide px-3 py-1">
        Most Popular
      </span>
    )}
    <h3 className="font-display text-2xl mb-1">{plan.name}</h3>
    <p className="text-chalk/50 text-sm mb-6">Billed {plan.billingCycle}</p>
    <p className="mb-6">
      <span className="font-display text-5xl">${plan.price}</span>
      <span className="text-chalk/50 text-sm">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
    </p>
    <ul className="space-y-3 mb-8 flex-1">
      {plan.perks?.map((perk) => (
        <li key={perk} className="flex items-start gap-2 text-sm text-chalk/80">
          <span className="text-volt mt-0.5">＋</span>
          {perk}
        </li>
      ))}
    </ul>
    <button
      onClick={() => onSelect?.(plan)}
      className={plan.isPopular ? 'btn-primary w-full' : 'btn-outline w-full'}
    >
      {actionLabel}
    </button>
    {onEdit && <button type="button" onClick={() => onEdit(plan)} className="btn-outline w-full mt-3">Edit plan</button>}
  </div>
);

export default PlanCard;

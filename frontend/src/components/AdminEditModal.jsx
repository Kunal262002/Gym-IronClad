import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

const AdminEditModal = ({ type, item, trainers = [], onClose, onSaved }) => {
  const [form, setForm] = useState({});
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (type === 'trainer') setForm({ ...item });
    if (type === 'plan') setForm({ ...item, perks: item.perks?.join('\n') || '' });
    if (type === 'class') setForm({ ...item, trainer: item.trainer?._id || item.trainer });
  }, [item, type]);

  const handleChange = (event) => {
    const { name, value, type: inputType, checked } = event.target;
    setForm((current) => ({ ...current, [name]: inputType === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      let data = { ...form };
      if (type === 'plan') data.perks = form.perks.split('\n').map((perk) => perk.trim()).filter(Boolean);
      if (type === 'trainer') {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (!['_id', '__v', 'createdAt', 'updatedAt', 'social'].includes(key)) formData.append(key, value ?? '');
        });
        if (photo) formData.set('photo', photo);
        const response = await api.put(`/trainers/${item._id}`, formData);
        data = response.data.data;
      } else {
        const endpoint = type === 'plan' ? 'memberships' : 'classes';
        const response = await api.put(`/${endpoint}/${item._id}`, data);
        data = response.data.data;
      }
      onSaved(data);
      onClose();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update this item.');
    } finally {
      setSaving(false);
    }
  };

  const title = type === 'trainer' ? 'EDIT TRAINER' : type === 'plan' ? 'EDIT MEMBERSHIP PLAN' : 'EDIT CLASS';
  const fields = type === 'trainer'
    ? [['name', 'Name', 'text'], ['specialty', 'Specialty', 'text'], ['experienceYears', 'Years coaching', 'number'], ['bio', 'Bio', 'textarea']]
    : type === 'plan'
      ? [['name', 'Name', 'text'], ['price', 'Price', 'number'], ['perks', 'Perks, one per line', 'textarea']]
      : [['title', 'Title', 'text'], ['description', 'Description', 'textarea'], ['startTime', 'Start time', 'time'], ['durationMinutes', 'Duration (minutes)', 'number'], ['capacity', 'Capacity', 'number']];

  return (
    <div className="fixed inset-0 z-50 bg-ink/90 px-4 py-6 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="edit-title">
      <div className="card max-w-2xl mx-auto my-4">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 id="edit-title" className="font-display text-2xl">{title}</h2>
          <button type="button" onClick={onClose} className="text-chalk/60 hover:text-volt" aria-label="Close editor">Close</button>
        </div>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          {fields.map(([name, label, inputType]) => <div key={name} className={inputType === 'textarea' ? 'sm:col-span-2' : ''}>
            <label htmlFor={`edit-${name}`} className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">{label}</label>
            {inputType === 'textarea' ? <textarea id={`edit-${name}`} name={name} required value={form[name] || ''} onChange={handleChange} className="input-field min-h-24" /> : <input id={`edit-${name}`} name={name} type={inputType} required min={inputType === 'number' ? 0 : undefined} value={form[name] ?? ''} onChange={handleChange} className="input-field" />}
          </div>)}
          {type === 'trainer' && <div className="sm:col-span-2"><label htmlFor="edit-photo" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">Replace photo</label><input id="edit-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files[0])} className="block w-full text-sm text-chalk/60" /></div>}
          {type === 'plan' && <><div><label htmlFor="edit-billingCycle" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">Billing cycle</label><select id="edit-billingCycle" name="billingCycle" value={form.billingCycle || 'monthly'} onChange={handleChange} className="input-field"><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div><label className="flex items-center gap-3 mt-8"><input name="isPopular" type="checkbox" checked={Boolean(form.isPopular)} onChange={handleChange} /> Popular plan</label></>}
          {type === 'class' && <><div><label htmlFor="edit-trainer" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">Trainer</label><select id="edit-trainer" name="trainer" required value={form.trainer || ''} onChange={handleChange} className="input-field"><option value="">Select trainer</option>{trainers.map((trainer) => <option key={trainer._id} value={trainer._id}>{trainer.name}</option>)}</select></div><div><label htmlFor="edit-dayOfWeek" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">Day</label><select id="edit-dayOfWeek" name="dayOfWeek" value={form.dayOfWeek || 'Monday'} onChange={handleChange} className="input-field">{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => <option key={day}>{day}</option>)}</select></div></>}
          {error && <p className="sm:col-span-2 text-rust">{error}</p>}
          <div className="sm:col-span-2 flex gap-3"><button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button><button type="button" onClick={onClose} className="btn-outline">Cancel</button></div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditModal;
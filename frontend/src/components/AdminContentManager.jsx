import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

const emptyTrainer = { name: '', specialty: '', bio: '', experienceYears: 0, photoUrl: '' };
const emptyPlan = { name: '', price: 0, billingCycle: 'monthly', perks: '', isPopular: false };
const emptyClass = { title: '', description: '', trainer: '', dayOfWeek: 'Monday', startTime: '09:00', durationMinutes: 60, capacity: 10 };

const AdminContentManager = ({ resource, modal = false, onClose }) => {
  const [activeTab, setActiveTab] = useState(resource || 'trainers');
  const [items, setItems] = useState({ trainers: [], plans: [], classes: [] });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTrainer);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const loadItems = async () => {
    const [trainers, plans, classes] = await Promise.all([
      api.get('/trainers'), api.get('/memberships'), api.get('/classes'),
    ]);
    setItems({ trainers: trainers.data.data, plans: plans.data.data, classes: classes.data.data });
  };

  useEffect(() => { loadItems().catch((err) => setError(err.response?.data?.message || 'Could not load content.')); }, []);

  const resetForm = (tab = activeTab) => {
    setEditing(null);
    setPhoto(null);
    setForm(tab === 'trainers' ? emptyTrainer : tab === 'plans' ? emptyPlan : emptyClass);
  };

  const selectTab = (tab) => { setActiveTab(tab); resetForm(tab); setVisibleCount(5); setMessage(''); setError(''); };

  const editItem = (item) => {
    setEditing(item._id);
    setPhoto(null);
    if (activeTab === 'trainers') setForm({ ...item });
    if (activeTab === 'plans') setForm({ ...item, perks: item.perks.join('\n') });
    if (activeTab === 'classes') setForm({ ...item, trainer: item.trainer?._id || item.trainer });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true); setMessage(''); setError('');
    try {
      const wasEditing = Boolean(editing);
      const isTrainer = activeTab === 'trainers';
      const endpoint = isTrainer ? '/trainers' : activeTab === 'plans' ? '/memberships' : '/classes';
      const payload = { ...form };
      if (activeTab === 'plans') payload.perks = form.perks.split('\n').map((perk) => perk.trim()).filter(Boolean);
      if (isTrainer) {
        const data = new FormData();
        Object.entries(payload).forEach(([key, value]) => { if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') data.append(key, value); });
        if (photo) data.set('photo', photo);
        await api({ method: editing ? 'put' : 'post', url: editing ? `${endpoint}/${editing}` : endpoint, data });
      } else {
        await api({ method: editing ? 'put' : 'post', url: editing ? `${endpoint}/${editing}` : endpoint, data: payload });
      }
      await loadItems();
      setVisibleCount(5);
      resetForm();
      setMessage(`${activeTab === 'trainers' ? 'Trainer' : activeTab === 'plans' ? 'Membership plan' : 'Class'} ${wasEditing ? 'updated' : 'created'} successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes.');
    } finally { setSaving(false); }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Remove this item?')) return;
    const endpoint = activeTab === 'trainers' ? '/trainers' : activeTab === 'plans' ? '/memberships' : '/classes';
    try { await api.delete(`${endpoint}/${id}`); await loadItems(); setVisibleCount(5); setMessage('Item removed.'); } catch (err) { setError(err.response?.data?.message || 'Could not remove item.'); }
  };

  const fields = activeTab === 'trainers'
    ? [['name', 'Name', 'text'], ['specialty', 'Specialty', 'text'], ['experienceYears', 'Years coaching', 'number'], ['bio', 'Bio', 'textarea']]
    : activeTab === 'plans'
      ? [['name', 'Name', 'text'], ['price', 'Price', 'number'], ['perks', 'Perks, one per line', 'textarea']]
      : [['title', 'Title', 'text'], ['description', 'Description', 'textarea'], ['startTime', 'Start time', 'time'], ['durationMinutes', 'Duration (minutes)', 'number'], ['capacity', 'Capacity', 'number']];

  return (
    <div className={modal ? 'fixed inset-0 z-50 overflow-y-auto bg-ink/90 px-4 py-6' : ''}>
      <div className={modal ? 'max-w-5xl mx-auto my-4' : ''}>
      <p className="section-eyebrow">Content Studio</p>
      <div className="flex items-start justify-between gap-4 mb-5">
        <h2 className="font-display text-3xl">{resource ? `MANAGE ${resource === 'plans' ? 'MEMBERSHIP PLANS' : resource.toUpperCase()}` : 'MANAGE GYM CONTENT'}</h2>
        {modal && <button type="button" onClick={onClose} className="btn-outline px-4 py-2">Close</button>}
      </div>
      {!resource && <div className="flex flex-wrap gap-2 mb-5">
        {['trainers', 'plans', 'classes'].map((tab) => <button key={tab} type="button" onClick={() => selectTab(tab)} className={activeTab === tab ? 'btn-primary' : 'btn-outline'}>{tab === 'plans' ? 'Membership Plans' : tab}</button>)}
      </div>}
      {message && <p className="text-volt mb-5">{message}</p>}
      {error && <p className="text-rust mb-5">{error}</p>}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <form onSubmit={handleSubmit} className="card grid md:grid-cols-2 gap-4">
          {fields.map(([name, label, type]) => <div key={name} className={type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="block text-sm uppercase tracking-wide text-chalk/60 mb-2" htmlFor={`admin-${name}`}>{label}</label>
            {type === 'textarea' ? <textarea id={`admin-${name}`} name={name} required value={form[name]} onChange={handleChange} className="input-field min-h-20" /> : <input id={`admin-${name}`} name={name} type={type} required min={type === 'number' ? 0 : undefined} value={form[name]} onChange={handleChange} className="input-field" />}
          </div>)}
          {activeTab === 'trainers' && <div><label className="block text-sm uppercase tracking-wide text-chalk/60 mb-2" htmlFor="admin-photo">Trainer photo</label><input id="admin-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files[0])} className="block w-full text-sm text-chalk/60" /></div>}
          {activeTab === 'trainers' && <div><label className="block text-sm uppercase tracking-wide text-chalk/60 mb-2" htmlFor="admin-photoUrl">Photo URL (optional)</label><input id="admin-photoUrl" name="photoUrl" value={form.photoUrl || ''} onChange={handleChange} className="input-field" /></div>}
          {activeTab === 'plans' && <><div><label className="block text-sm uppercase tracking-wide text-chalk/60 mb-2" htmlFor="admin-billingCycle">Billing cycle</label><select id="admin-billingCycle" name="billingCycle" value={form.billingCycle} onChange={handleChange} className="input-field"><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div><label className="flex items-center gap-3 mt-8"><input name="isPopular" type="checkbox" checked={form.isPopular} onChange={handleChange} /> Popular plan</label></>}
          {activeTab === 'classes' && <><div><label className="block text-sm uppercase tracking-wide text-chalk/60 mb-2" htmlFor="admin-trainer">Trainer</label><select id="admin-trainer" name="trainer" required value={form.trainer} onChange={handleChange} className="input-field"><option value="">Select trainer</option>{items.trainers.map((trainer) => <option key={trainer._id} value={trainer._id}>{trainer.name}</option>)}</select></div><div><label className="block text-sm uppercase tracking-wide text-chalk/60 mb-2" htmlFor="admin-dayOfWeek">Day</label><select id="admin-dayOfWeek" name="dayOfWeek" value={form.dayOfWeek} onChange={handleChange} className="input-field">{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => <option key={day}>{day}</option>)}</select></div></>}
          <div className="md:col-span-2 flex flex-wrap gap-3"><button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Saving...' : editing ? 'Update' : 'Add new'}</button>{editing && <button type="button" onClick={() => resetForm()} className="btn-outline">Cancel</button>}</div>
        </form>
        <div className="max-h-[32rem] overflow-y-auto pr-2 space-y-3">
          {items[activeTab].slice(0, visibleCount).map((item) => <div key={item._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="font-bold">{item.name || item.title}</p><p className="text-sm text-chalk/50">{activeTab === 'classes' ? `${item.dayOfWeek} at ${item.startTime}` : activeTab === 'plans' ? `$${item.price} / ${item.billingCycle}` : item.specialty}</p></div><div className="flex gap-2"><button type="button" onClick={() => editItem(item)} className="btn-outline px-4 py-2">Edit</button><button type="button" onClick={() => removeItem(item._id)} className="btn-outline px-4 py-2 text-rust">Remove</button></div></div>)}
          {visibleCount < items[activeTab].length && (
            <div className="mt-3 flex gap-3">
              <button type="button" onClick={() => setVisibleCount((count) => count + 5)} className="btn-outline flex-1">More</button>
              {visibleCount > 5 && <button type="button" onClick={() => setVisibleCount(5)} className="btn-outline flex-1">Less</button>}
            </div>
          )}
          {visibleCount >= items[activeTab].length && visibleCount > 5 && <button type="button" onClick={() => setVisibleCount(5)} className="btn-outline w-full mt-3">Less</button>}
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminContentManager;
import { useState, cloneElement } from 'react';
import { SERVICES } from './content';

const EMPTY = { name: '', phone: '', service: '', date: '', time: '', notes: '' };
const TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

function validate(f) {
  const e = {};
  const today = new Date().toISOString().slice(0, 10);
  if (!f.name.trim()) e.name = 'Please enter your name.';
  if (!/^\+?[0-9\s-]{8,15}$/.test(f.phone.trim())) e.phone = 'Enter a valid phone number.';
  if (!f.service) e.service = 'Choose a service.';
  if (!f.date) e.date = 'Choose a date.';
  else if (f.date < today) e.date = 'The date cannot be in the past.';
  if (!f.time) e.time = 'Choose a time.';
  return e;
}

export default function Booking() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const onChange = (ev) => {
    const { name, value } = ev.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) { setDone(false); return; }
    setDone(true);
    setForm(EMPTY);
  };

  return (
    <form className="booking-form" onSubmit={onSubmit} noValidate>
      <Field label="Full name" name="name" error={errors.name}>
        <input name="name" value={form.name} onChange={onChange} autoComplete="name" />
      </Field>
      <Field label="Phone number" name="phone" error={errors.phone}>
        <input name="phone" type="tel" value={form.phone} onChange={onChange} autoComplete="tel" />
      </Field>
      <Field label="Preferred service" name="service" error={errors.service}>
        <select name="service" value={form.service} onChange={onChange}>
          <option value="">Select a service</option>
          {SERVICES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select>
      </Field>
      <Field label="Appointment date" name="date" error={errors.date}>
        <input name="date" type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={onChange} />
      </Field>
      <Field label="Preferred time" name="time" error={errors.time}>
        <select name="time" value={form.time} onChange={onChange}>
          <option value="">Select a time</option>
          {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Additional notes (optional)" name="notes">
        <textarea name="notes" rows="3" value={form.notes} onChange={onChange} />
      </Field>
      <button type="submit" className="btn btn-gold">Request Appointment</button>

      {done && (
        <p className="success" role="status">
          Thank you! Your request has been recorded in this demo form. This is a front-end demo, so nothing has been sent or stored yet. Connect a backend to receive real bookings.
        </p>
      )}
    </form>
  );
}

function Field({ label, name, error, children }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {cloneElement(children, { id: name })}
      {error && <span className="error" role="alert">{error}</span>}
    </div>
  );
}
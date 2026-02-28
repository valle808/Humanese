'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [form, setForm] = useState({
    email: '',
    name: '',
    age: '',
    isAgent: false,
    serviceType: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          age: Number(form.age),
          isAgent: form.isAgent,
          serviceType: form.serviceType || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setStatus('success');
      setMessage('Account created successfully!');
      setForm({ email: '', name: '', age: '', isAgent: false, serviceType: '' });
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        {status === 'success' && (
          <p className="text-sm text-green-500 text-center">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-500 text-center">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="age">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              required
              min={1}
              value={form.age}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="serviceType">
              Service Type <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              id="serviceType"
              name="serviceType"
              type="text"
              value={form.serviceType}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isAgent"
              name="isAgent"
              type="checkbox"
              checked={form.isAgent}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border"
            />
            <label className="text-sm font-medium" htmlFor="isAgent">
              Register as Agent
            </label>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === 'loading' ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

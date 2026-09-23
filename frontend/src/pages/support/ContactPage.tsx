/**
 * @file        ContactPage.tsx
 * @description Contact form — name, email, subject, message. Submits to
 *              a stub endpoint until the backend is wired.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-20
 * @updated     2026-09-20
 * @version     1.0.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import AuthLayout from '@/components/layout/AuthLayout';
import { Form, FormField } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const canSubmit = name.trim() && email.trim() && message.trim() && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      // TODO: await api.post('/contact', { name, email, subject, message });
      console.log('Contact submission:', { name, email, subject, message });
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? 'Could not send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="Get in touch with A Team Stars"
      children={
        <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-925">
          <div className="relative z-10 p-6 sm:p-10 space-y-6">
            <div className="text-center">
              <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide uppercase">
                Contact Us
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Questions, feedback, or want to visit? Drop us a message.
              </p>
            </div>

            <div className="flex justify-center w-full">
              {sent ? (
                <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 text-center space-y-4 backdrop-blur-md">
                  <div className="h-12 w-12 mx-auto rounded-full bg-crimson-950 border border-crimson-800 flex items-center justify-center">
                    <svg className="w-6 h-6 text-crimson-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Message sent</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Thanks, {name.split(' ')[0]}. We'll get back to you at <span className="text-white">{email}</span> shortly.
                  </p>
                  <LinkButton tone="accent" onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }}>
                    Send another message
                  </LinkButton>
                </div>
              ) : (
                <Form onSubmit={handleSubmit} error={error} loading={loading}>
                  <div className="text-xs text-crimson-400 uppercase tracking-widest border-b border-zinc-800 pb-2.5">
                    Send a Message
                  </div>

                  <FormField
                    label="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    required
                    autoFocus
                  />

                  <FormField
                    label="Email Address"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />

                  <FormField
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Membership enquiry"
                  />

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind…"
                      rows={5}
                      required
                      disabled={loading}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-crimson-600 resize-none"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={!canSubmit}>
                    Send Message
                  </Button>

                  <div className="pt-2 text-center">
                    <LinkButton tone="muted" onClick={() => navigate('/login')}>
                      ← Back to sign in
                    </LinkButton>
                  </div>
                </Form>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ContactPage;
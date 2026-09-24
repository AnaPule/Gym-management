/**
 * @file        ContactPage.tsx
 * @description Contact form with category-based routing. Reachable from
 *              the login/signup pages (unauthenticated) and, once the app
 *              shell exists, from the dashboard sidebar. Messages
 *              categorised as "About my child" route to the safeguarding
 *              officer rather than the general inbox.
 * @author      Ana Pule
 * @created     2026-09-20
 * @updated     2026-09-24
 * @version     1.1.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { Form, FormField } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import LinkButton from '@/components/ui/LinkButton';
import Dropdown from '@/components/ui/Dropdown';

/**
 * Message categories. The `value` is what gets sent to the backend, which
 * uses it to route — most go to the general inbox, `about-my-child` goes
 * to the safeguarding officer.
 */
const CATEGORIES = [
  'General enquiry',
  'Membership question',
  'Complaint',
  'Feedback',
  'Lost property',
  'About my child',
] as const;

type Category = (typeof CATEGORIES)[number];

const SAFEGUARDING_CATEGORY: Category = 'About my child';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const isSafeguarding = category === SAFEGUARDING_CATEGORY;

  const canSubmit =
    name.trim().length > 1 &&
    email.trim().length > 0 &&
    category !== '' &&
    message.trim().length > 0 &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    try {
      // TODO: POST /api/v1/contact
      //       When category === 'About my child', the backend routes this
      //       to the safeguarding officer instead of the general inbox.
      console.log('Contact submission:', { name, email, category, subject, message });
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? 'Could not send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnother = () => {
    setSent(false);
    setName('');
    setEmail('');
    setCategory('');
    setSubject('');
    setMessage('');
  };

  return (
    <AuthLayout headline="Get in touch with Team Stars">
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
                  <svg
                    className="w-6 h-6 text-crimson-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Message sent</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Thanks, {name.split(' ')[0]}. We'll get back to you at{' '}
                  <span className="text-white">{email}</span> shortly.
                  {isSafeguarding && (
                    <span className="block mt-2 text-crimson-300">
                      Your message has been routed to our safeguarding officer.
                    </span>
                  )}
                </p>
                <LinkButton tone="accent" onClick={handleSendAnother}>
                  Send another message
                </LinkButton>
              </div>
            ) : (
              <Form onSubmit={handleSubmit} error={error} loading={loading}>
                <div className="text-xs text-crimson-400 uppercase tracking-widest border-b border-zinc-800 pb-2.5">
                  Send a message
                </div>

                <FormField
                  label="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  required
                  autoFocus
                />

                <FormField
                  label="Email address"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />

                <Dropdown
                  label="Category"
                  value={category}
                  onChange={(v) => setCategory(v as Category)}
                  options={[...CATEGORIES]}
                  placeholder="What's this about?"
                  required
                />

                {/* Safeguarding notice — only when the child category is picked */}
                {isSafeguarding && (
                  <div className="rounded-xl border border-crimson-800/60 bg-crimson-950/20 px-4 py-3 flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-crimson-400">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </span>
                    <p className="text-[11px] text-crimson-200 leading-relaxed">
                      This message will be routed to our safeguarding officer,
                      not the general inbox. Your child's safety is our
                      priority.
                    </p>
                  </div>
                )}

                <FormField
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Membership enquiry"
                />

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Message
                    <span className="text-crimson-500 ml-1" aria-hidden="true">*</span>
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

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={!canSubmit}
                >
                  Send message
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
    </AuthLayout>
  );
};

export default ContactPage;
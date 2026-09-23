/**
 * @file        ConsentCard.tsx
 * @description One signable consent — title, scrollable body, checkbox.
 *              Reused for adult consents and the extended minor set.
 * @author      Morwetsana Mahlatsepule
 * @created     2026-09-21
 * @updated     2026-09-21
 * @version     1.0.0
 */

import React from 'react';

interface ConsentCardProps {
  title: string;
  body: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ConsentCard: React.FC<ConsentCardProps> = ({ title, body, checked, onChange }) => {
  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        checked ? 'border-crimson-700/60 bg-crimson-950/20' : 'border-zinc-800 bg-zinc-950/50'
      }`}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-crimson-600 shrink-0 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-2">{title}</p>
          <div className="max-h-32 overflow-y-auto text-[12px] leading-relaxed text-zinc-400 pr-2">
            {body}
          </div>
        </div>
      </label>
    </div>
  );
};

export default ConsentCard;
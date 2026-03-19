import React from 'react';

interface BadgeProps {
  name: string;
  icon?: React.ReactNode;
  earnedAt?: string;
  description?: string;
}

const Badge: React.FC<BadgeProps> = ({ name, icon, earnedAt, description }) => {
  return (
    <div className="flex flex-col items-center p-3 bg-[var(--color-brand-panel)] border border-[#2A2A35] rounded-xl hover:border-[var(--color-brand-primary)] transition-all">
      <div className="w-12 h-12 flex items-center justify-center bg-[#1A1A22] rounded-full text-[var(--color-brand-primary)] mb-2 shadow-inner">
        {icon || <span className="text-xl font-bold">{name.charAt(0)}</span>}
      </div>
      <h4 className="text-sm font-bold text-center text-white">{name}</h4>
      {description && <p className="text-xs text-[var(--color-brand-text-secondary)] text-center mt-1">{description}</p>}
      {earnedAt && <span className="text-[10px] text-gray-500 mt-2">{new Date(earnedAt).toLocaleDateString()}</span>}
    </div>
  );
};

export default Badge;

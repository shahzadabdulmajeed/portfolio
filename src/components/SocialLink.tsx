import React, { useState } from 'react';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  size?: number;
  /** 'up' = tooltip above the icon (default), 'down' = tooltip below */
  tooltipDir?: 'up' | 'down';
}

export const SocialLink: React.FC<SocialLinkProps> = ({
  href, icon, label, size = 40, tooltipDir = 'up',
}) => {
  const [hovered, setHovered] = useState(false);
  const isDown = tooltipDir === 'down';

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: `translateX(-50%) translateY(${hovered ? (isDown ? '6px' : '-6px') : (isDown ? '2px' : '-2px')})`,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 7,
    padding: '4px 10px',
    fontSize: '0.68rem',
    fontWeight: 700,
    color: 'var(--text-base)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: hovered ? 1 : 0,
    transition: 'opacity 0.15s, transform 0.15s',
    boxShadow: 'var(--shadow-md)',
    zIndex: 200,
    ...(isDown
      ? { top: '100%', marginTop: 6 }
      : { bottom: '100%', marginBottom: 6 }),
  };

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0, height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    ...(isDown
      ? { bottom: '100%', borderBottom: '5px solid var(--border)', borderTop: 'none' }
      : { top: '100%', borderTop: '5px solid var(--border)', borderBottom: 'none' }),
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: size, height: size, borderRadius: 10,
          background: hovered ? 'var(--indigo-dim)' : 'var(--bg-card)',
          border: `1px solid ${hovered ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: hovered ? 'var(--indigo)' : 'var(--text-muted)',
          boxShadow: hovered ? '0 2px 10px var(--indigo-glow)' : 'var(--shadow-sm)',
          transition: 'all 0.18s', textDecoration: 'none',
        }}
      >
        {icon}
      </a>

      <div style={tooltipStyle}>
        {label}
        <div style={arrowStyle} />
      </div>
    </div>
  );
};

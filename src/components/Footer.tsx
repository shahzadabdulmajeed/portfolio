import React from 'react';
import { Mail, ChevronUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon, HuggingFaceIcon } from './SocialIcons';
import { SocialLink } from './SocialLink';
import { useDB } from '../hooks/useDB';

const Footer: React.FC = () => {
  const { data } = useDB();
  const about = data?.about;

  const socials = [
    about?.githubUrl      && { href: about.githubUrl,      icon: <GithubIcon className="w-4 h-4" />,      label: 'GitHub' },
    about?.linkedinUrl    && { href: about.linkedinUrl,    icon: <LinkedinIcon className="w-4 h-4" />,     label: 'LinkedIn' },
    about?.huggingfaceUrl && { href: about.huggingfaceUrl, icon: <HuggingFaceIcon className="w-4 h-4" />, label: 'HuggingFace' },
    about?.email          && { href: `mailto:${about.email}`, icon: <Mail size={15} />,                    label: 'Email' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[];

  return (
    <footer style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', padding: '48px 0 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>
        <div className="footer-inner">

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9999, overflow: 'hidden', border: '2px solid rgba(99,102,241,0.35)', flexShrink: 0, boxShadow: '0 0 0 3px var(--indigo-dim)' }}>
              {about?.photo && (
                <img src={about.photo} alt="M.Shahzad"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              )}
            </div>
            <div>
              <p style={{ fontWeight: 800, color: 'var(--text-base)', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
                M.<span style={{ color: 'var(--indigo)' }}>Shahzad</span>
              </p>
              <p style={{ color: 'var(--text-faint)', fontSize: '0.73rem', marginTop: 1 }}>
                {about?.title ?? 'Full-Stack AI Engineer'}
              </p>
            </div>
          </div>

          {/* Socials */}
          <div style={{ display: 'flex', gap: 8 }}>
            {socials.map(({ href, icon, label }) => (
              <SocialLink key={href} href={href} icon={icon} label={label} size={38} />
            ))}
          </div>

          {/* Scroll to top */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ width: 40, height: 40, borderRadius: 10, cursor: 'pointer', background: 'var(--bg-card)', border: '1.5px solid var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s', boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'var(--indigo)'; el.style.color = '#fff'; el.style.borderColor = 'var(--indigo)'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'var(--bg-card)'; el.style.color = 'var(--text-muted)'; el.style.borderColor = 'var(--border)'; }}>
            <ChevronUp size={17} />
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, textAlign: 'center', color: 'var(--text-faint)', fontSize: '0.73rem', letterSpacing: '0.01em' }}>
          © {new Date().getFullYear()} M.Shahzad · All rights reserved · Built with React
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Menu, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon, LinkedinIcon, HuggingFaceIcon } from './SocialIcons';
import { SocialLink } from './SocialLink';
import { useDB } from '../hooks/useDB';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data } = useDB();
  const about = data?.about;
  const categories = data?.categories ?? [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = categories
    .filter(c => c.id !== 'all')
    .map(c => ({ name: c.name, href: `#${c.id}` }));
  navLinks.push({ name: 'About', href: '#about' });

  const socials = [
    about?.githubUrl      && { href: about.githubUrl,      icon: <GithubIcon className="w-4 h-4" />,      label: 'GitHub' },
    about?.linkedinUrl    && { href: about.linkedinUrl,    icon: <LinkedinIcon className="w-4 h-4" />,     label: 'LinkedIn' },
    about?.huggingfaceUrl && { href: about.huggingfaceUrl, icon: <HuggingFaceIcon className="w-4 h-4" />, label: 'HuggingFace' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[];

  const navBg = scrolled
    ? 'rgba(248,250,252,0.94)'
    : 'transparent';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: navBg,
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(15,23,42,0.08)' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 10px rgba(15,23,42,0.06)' : 'none',
      transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Row 1: Logo + Socials ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: scrolled ? '8px 0 6px' : '14px 0 8px', transition: 'padding 0.3s' }}>

          {/* Logo */}
          <motion.a href="/" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9999, overflow: 'hidden', border: '2px solid var(--indigo)', flexShrink: 0, boxShadow: '0 0 0 3px var(--indigo-dim)' }}>
              {about?.photo && (
                <img src={about.photo} alt={data?.hero?.name ?? 'M.Shahzad'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              )}
            </div>
            <span className="nav-name" style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-base)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              M.<span style={{ color: 'var(--indigo)' }}>Shahzad</span>
            </span>
          </motion.a>

          {/* Right side: Socials (desktop) + Hamburger (mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Social icons — hidden on mobile */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} className="desktop-nav">
              {socials.map(({ href, icon, label }) => (
                <SocialLink key={href} href={href} icon={icon} label={label} size={32} tooltipDir="down" />
              ))}
            </div>
            {/* Mobile hamburger */}
            <button onClick={() => setOpen(!open)}
              style={{ background: 'none', border: 'none', color: 'var(--text-base)', cursor: 'pointer', display: 'flex', padding: 4 }}
              className="mobile-menu-btn">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Row 2: Nav links (desktop only) — wraps automatically ── */}
        <div className="desktop-nav" style={{
          flexWrap: 'wrap',
          gap: '2px 2px',
          paddingBottom: scrolled ? '6px' : '10px',
          transition: 'padding 0.3s',
          borderTop: '1px solid var(--border)',
        }}>
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.83rem',
                padding: '5px 12px',
                borderRadius: 7,
                transition: 'color 0.15s, background 0.15s',
                whiteSpace: 'nowrap',
                marginTop: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--indigo)'; e.currentTarget.style.background = 'var(--indigo-dim)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {link.name}
            </motion.a>
          ))}
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: 'rgba(248,250,252,0.97)', borderBottom: '1px solid var(--border)', overflow: 'hidden', backdropFilter: 'blur(16px)' }}
            className="mobile-menu"
          >
            <div style={{ padding: '12px 24px 16px', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {navLinks.map(link => (
                <a key={link.name} href={link.href} onClick={() => setOpen(false)}
                  style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', padding: '11px 0', borderBottom: '1px solid var(--border)', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--indigo)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  {link.name}
                </a>
              ))}
              <div style={{ display: 'flex', gap: 14, paddingTop: 14 }}>
                {socials.map(({ href, icon, label }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    style={{ color: 'var(--text-faint)', display: 'flex', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--indigo)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}>
                    {icon}
                  </a>
                ))}
                {about?.email && (
                  <a href={`mailto:${about.email}`}
                    style={{ color: 'var(--text-faint)', display: 'flex', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--indigo)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}>
                    <Mail size={16} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

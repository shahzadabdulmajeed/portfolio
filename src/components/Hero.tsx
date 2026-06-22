import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Mail, Sparkles, ArrowDown } from 'lucide-react';
import { GithubIcon, LinkedinIcon, HuggingFaceIcon } from './SocialIcons';
import { SocialLink } from './SocialLink';
import { useDB } from '../hooks/useDB';

const Hero: React.FC = () => {
  const { data } = useDB();
  const [roleIndex, setRoleIndex] = useState(0);
  const hero  = data?.hero;
  const about = data?.about;
  const roles = hero?.roles ?? ['Full-Stack AI Engineer'];

  useEffect(() => {
    const id = setInterval(() => setRoleIndex(p => (p + 1) % roles.length), 3200);
    return () => clearInterval(id);
  }, [roles.length]);

  const socials = [
    about?.githubUrl      && { href: about.githubUrl,      icon: <GithubIcon className="w-5 h-5" />,      label: 'GitHub' },
    about?.linkedinUrl    && { href: about.linkedinUrl,    icon: <LinkedinIcon className="w-5 h-5" />,     label: 'LinkedIn' },
    about?.huggingfaceUrl && { href: about.huggingfaceUrl, icon: <HuggingFaceIcon className="w-5 h-5" />, label: 'HuggingFace' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[];

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 110, paddingBottom: 60, background: 'var(--bg)' }}>

      {/* Soft background orbs */}
      <div className="orb" style={{ width: 700, height: 700, top: '-15%', right: '-8%', background: '#e0e7ff', animationDelay: '0s', opacity: 0.6 }} />
      <div className="orb" style={{ width: 500, height: 500, bottom: '0%', left: '-8%', background: '#d1fae5', animationDelay: '4s', opacity: 0.45 }} />
      <div className="orb" style={{ width: 320, height: 320, top: '30%', left: '35%', background: '#ede9fe', animationDelay: '2s', opacity: 0.35 }} />

      {/* Subtle dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4, backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', width: '100%', position: 'relative', zIndex: 10 }}>
        <div className="hero-grid">

          {/* ── Left: Text ── */}
          <div>
            {/* Status badge */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 9999, border: '1px solid rgba(99,102,241,0.22)', background: 'rgba(99,102,241,0.07)', color: 'var(--indigo-dark)', fontSize: '0.78rem', fontWeight: 600, marginBottom: 28, letterSpacing: '0.01em' }}>
              <Sparkles size={13} />
              {hero?.badge ?? 'Open for new AI opportunities'}
            </motion.div>

            {/* Name */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.035em', marginBottom: 16, color: 'var(--text-base)' }}>
              Hi, I'm{' '}
              <span className="grad-text">{hero?.name ?? 'Shahzad'}</span>
            </motion.h1>

            {/* Animated role */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              style={{ height: 42, overflow: 'hidden', marginBottom: 22 }}>
              <AnimatePresence mode="wait">
                <motion.p key={roleIndex}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                  style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.45rem)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '-0.01em' }}>
                  {roles[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Description */}
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
              style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.82, marginBottom: 36, maxWidth: 520 }}>
              {hero ? hero.description.split(' ').map((word, i) => {
                const hi = hero.highlightWords.some(hw => hw.split(' ').includes(word));
                return <span key={i} style={hi ? { color: 'var(--text-base)', fontWeight: 700 } : {}}>{word} </span>;
              }) : null}
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <a href="#projects" className="btn-primary">View My Work</a>
              {about?.cvUrl
                ? <a href={about.cvUrl} download className="btn-ghost"><Download size={15} />Download CV</a>
                : <a href="#about" className="btn-ghost"><Mail size={15} />Contact Me</a>
              }
            </motion.div>

            {/* Socials row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {socials.map(({ href, icon, label }) => (
                <SocialLink key={href} href={href} icon={icon} label={label} size={40} />
              ))}
              {about?.email && (
                <a href={`mailto:${about.email}`} className="hero-email"
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--indigo)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  {about.email}
                </a>
              )}
            </motion.div>
          </div>

          {/* ── Right: Photo ── */}
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.55 }}
            style={{ position: 'relative' }} className="hero-photo-col">
            {/* Glow behind photo */}
            <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
            {/* Photo ring */}
            <div style={{ position: 'relative', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(99,102,241,0.25)', aspectRatio: '1', background: 'var(--bg-elevated)', boxShadow: '0 20px 60px rgba(99,102,241,0.15), 0 4px 20px rgba(15,23,42,0.08)' }}>
              {about?.photo && (
                <img src={about.photo} alt={hero?.name ?? 'M.Shahzad'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.04)')}
                  onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                />
              )}
            </div>
            {/* Availability badge */}
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.2, repeat: Infinity }}
              style={{ position: 'absolute', bottom: 28, right: -12, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow-md)' }}>
              <div style={{ width: 8, height: 8, borderRadius: 9999, background: 'var(--emerald)', boxShadow: '0 0 6px rgba(5,150,105,0.6)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-base)', whiteSpace: 'nowrap' }}>
                {about?.availability ?? 'Available for Freelance'}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          style={{ marginTop: 72, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, color: 'var(--text-faint)', fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          <span>Scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ArrowDown size={13} />
          </motion.div>
        </motion.div>
      </div>

      {/* Fade-to-bg at bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to top, var(--bg), transparent)', pointerEvents: 'none' }} />
    </section>
  );
};

export default Hero;

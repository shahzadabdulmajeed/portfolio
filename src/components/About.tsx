import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, User, Download, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon, HuggingFaceIcon } from './SocialIcons';
import { SocialLink } from './SocialLink';
import { useDB } from '../hooks/useDB';

const SKILL_ACCENT = [
  { line: '#6366f1', label: '#4f46e5', bg: 'rgba(99,102,241,0.07)',  border: 'rgba(99,102,241,0.20)', text: '#4338ca', glow: 'rgba(99,102,241,0.20)' },
  { line: '#059669', label: '#047857', bg: 'rgba(5,150,105,0.07)',   border: 'rgba(5,150,105,0.20)',  text: '#065f46', glow: 'rgba(5,150,105,0.18)'  },
  { line: '#d97706', label: '#b45309', bg: 'rgba(217,119,6,0.07)',   border: 'rgba(217,119,6,0.20)',  text: '#92400e', glow: 'rgba(217,119,6,0.18)'  },
  { line: '#db2777', label: '#be185d', bg: 'rgba(219,39,119,0.07)',  border: 'rgba(219,39,119,0.20)', text: '#9d174d', glow: 'rgba(219,39,119,0.18)' },
  { line: '#0891b2', label: '#0e7490', bg: 'rgba(8,145,178,0.07)',   border: 'rgba(8,145,178,0.20)',  text: '#155e75', glow: 'rgba(8,145,178,0.18)'  },
  { line: '#7c3aed', label: '#6d28d9', bg: 'rgba(124,58,237,0.07)',  border: 'rgba(124,58,237,0.20)', text: '#4c1d95', glow: 'rgba(124,58,237,0.18)' },
];

const About: React.FC = () => {
  const { data } = useDB();
  const about = data?.about;
  if (!about) return null;

  const contactItems = [
    { icon: <Mail size={14} />,    label: about.email,        href: `mailto:${about.email}` },
    { icon: <Phone size={14} />,   label: about.phone,        href: `tel:${about.phone}` },
    { icon: <MapPin size={14} />,  label: about.location,     href: null },
    { icon: <User size={14} />,    label: about.availability, href: null },
  ];

  const socials = [
    about.githubUrl      && { href: about.githubUrl,      icon: <GithubIcon className="w-4 h-4" />,      label: 'GitHub' },
    about.linkedinUrl    && { href: about.linkedinUrl,    icon: <LinkedinIcon className="w-4 h-4" />,     label: 'LinkedIn' },
    about.huggingfaceUrl && { href: about.huggingfaceUrl, icon: <HuggingFaceIcon className="w-4 h-4" />, label: 'HuggingFace' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[];

  const bioParagraphs = about.bio.split(/\n+/).filter(Boolean);

  return (
    <section id="about" style={{ padding: '100px 0', background: 'var(--bg-elevated)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>

        {/* Section heading */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 64 }}>
          <span className="section-label">✦ Who I Am</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, textAlign: 'center', color: 'var(--text-base)', letterSpacing: '-0.025em' }}>
            About <span className="grad-text">Me</span>
          </h2>
          <div className="section-divider" />
        </div>

        <div className="about-grid">

          {/* Photo column */}
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="about-photo-wrap">
              {/* Soft gradient blob behind photo */}
              <div style={{ position: 'absolute', inset: -12, borderRadius: 28, background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(5,150,105,0.08))', filter: 'blur(24px)' }} />
              <div style={{ position: 'relative', background: 'var(--bg-card)', borderRadius: 22, padding: 6, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                {about.photo && (
                  <img src={about.photo} alt="M.Shahzad"
                    style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 18, display: 'block', transition: 'transform 0.5s' }}
                    onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.02)')}
                    onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                  />
                )}
              </div>

              {/* Years badge */}
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="about-badge-right"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 18px', boxShadow: 'var(--shadow-md)', textAlign: 'center', minWidth: 88 }}>
                <p style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--indigo)', lineHeight: 1 }}>{about.yearsExp || '2'}+</p>
                <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-faint)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Years Exp.</p>
              </motion.div>

              {/* Projects badge */}
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="about-badge-left"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 18px', boxShadow: 'var(--shadow-md)', textAlign: 'center', minWidth: 88 }}>
                <p style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--emerald)', lineHeight: 1 }}>
                  {about.projectsCount || data?.projects.length || 9}+
                </p>
                <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-faint)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Projects</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Info column */}
          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h3 style={{ fontSize: '1.55rem', fontWeight: 800, marginBottom: 4, color: 'var(--text-base)', letterSpacing: '-0.02em' }}>{about.title}</h3>

            {/* Bio paragraphs */}
            <div style={{ marginBottom: 28 }}>
              {bioParagraphs.map((para, i) => (
                <p key={i} style={{ fontSize: '0.93rem', color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: i < bioParagraphs.length - 1 ? 14 : 0 }}>{para}</p>
              ))}
            </div>

            {/* Contact grid */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', marginBottom: 28, boxShadow: 'var(--shadow-sm)' }}>
              <div className="about-contact-grid">
                {contactItems.map(({ icon, label, href }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--indigo)', flexShrink: 0, opacity: 0.8 }}>{icon}</span>
                    {href
                      ? <a href={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.18s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--indigo)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>{label}</a>
                      : <span>{label}</span>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              {about.skillGroups.map(({ label, items }, gi) => {
                const accent = SKILL_ACCENT[gi % SKILL_ACCENT.length];
                return (
                  <div key={label}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ width: 3, height: 14, borderRadius: 9999, background: accent.line, display: 'inline-block', flexShrink: 0 }} />
                      <p style={{ fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.13em', color: accent.label, textTransform: 'uppercase' }}>{label}</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {items.map((item, ii) => (
                        <motion.span
                          key={item}
                          initial={{ opacity: 0, scale: 0.88, y: 5 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.25, delay: gi * 0.05 + ii * 0.03 }}
                          whileHover={{ scale: 1.06, y: -2 }}
                          style={{
                            padding: '5px 13px',
                            borderRadius: 9999,
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            background: accent.bg,
                            border: `1px solid ${accent.border}`,
                            color: accent.text,
                            cursor: 'default',
                            display: 'inline-block',
                            transition: 'box-shadow 0.18s',
                          }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 2px 10px ${accent.glow}`)}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Socials + CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {about.cvUrl && (
                <a href={about.cvUrl} download className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 22px' }}>
                  <Download size={14} /> Download CV
                </a>
              )}
              <a href={`mailto:${about.email}`} className="btn-ghost" style={{ fontSize: '0.875rem', padding: '10px 22px' }}>
                <ExternalLink size={14} /> Let's Talk
              </a>
              {socials.map(({ href, icon, label }) => (
                <SocialLink key={href} href={href} icon={icon} label={label} size={38} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

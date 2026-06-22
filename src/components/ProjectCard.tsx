import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../types/db';
import * as Icons from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const IconComponent = (Icons as any)[project.icon] || Icons.Code2;

  return (
    <motion.a
      href={`/project/${project.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.32 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit',
        borderRadius: 16, overflow: 'hidden',
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
        boxShadow: hovered ? '0 12px 40px rgba(99,102,241,0.12), 0 4px 16px rgba(15,23,42,0.06)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'border-color 0.22s, box-shadow 0.22s, transform 0.22s',
        cursor: 'pointer',
      }}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
        <img src={project.coverImage} alt={project.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)', display: 'block' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />

        {/* Subtle overlay — lighter in light mode */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(248,250,252,0.6) 0%, transparent 60%)', opacity: hovered ? 0.7 : 0.3, transition: 'opacity 0.3s' }} />

        {/* Top-left tags */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{ padding: '3px 10px', borderRadius: 9999, fontSize: '0.67rem', fontWeight: 700, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', border: '1px solid rgba(99,102,241,0.20)', color: 'var(--indigo-dark)', letterSpacing: '0.03em' }}>{tag}</span>
          ))}
        </div>

        {/* Top-right arrow */}
        <div style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 9999, background: 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.22s', boxShadow: '0 2px 10px rgba(99,102,241,0.35)' }}>
          <ArrowUpRight size={16} color="#fff" />
        </div>

        {/* Bottom-left icon */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(99,102,241,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--indigo)' }}>
          <IconComponent size={17} />
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6, color: hovered ? 'var(--indigo)' : 'var(--text-base)', transition: 'color 0.2s', letterSpacing: '-0.01em' }}>
          {project.name}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 14 }}>
          {project.description}
        </p>
        {/* Tool pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
          {project.tools.slice(0, 3).map(tool => (
            <span key={tool} style={{ padding: '3px 10px', borderRadius: 7, fontSize: '0.68rem', fontWeight: 600, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{tool}</span>
          ))}
          {project.tools.length > 3 && (
            <span style={{ padding: '3px 10px', borderRadius: 7, fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-faint)' }}>+{project.tools.length - 3} more</span>
          )}
        </div>
      </div>
    </motion.a>
  );
};

export default ProjectCard;

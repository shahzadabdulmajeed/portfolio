import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { useDB } from '../hooks/useDB';

const ProjectGrid: React.FC = () => {
  const { data, loading } = useDB();
  const [activeTab, setActiveTab] = useState('all');

  const categories = data?.categories ?? [{ id: 'all', name: 'All Work' }];
  const projects = data?.projects ?? [];

  const filtered = projects.filter(p =>
    activeTab === 'all' ? true : p.category === activeTab
  );

  if (loading) return (
    <section style={{ padding: '100px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading projects…
      </div>
    </section>
  );

  return (
    <section id="projects" style={{ padding: '100px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>

        {/* Heading */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 60 }}>
          <span className="section-label">✦ Portfolio</span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.7rem)', fontWeight: 800, textAlign: 'center', color: 'var(--text-base)', letterSpacing: '-0.028em', marginBottom: 14 }}>
            Featured <span className="grad-text">Projects</span>
          </h2>
          <div className="section-divider" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.97rem', maxWidth: 460, textAlign: 'center', lineHeight: 1.75, marginTop: 18, marginBottom: 36 }}>
            A curated selection of AI, computer vision, and full-stack projects I've shipped.
          </p>

          {/* Filter tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {categories.map(cat => {
              const isActive = activeTab === cat.id;
              return (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)}
                  style={{
                    padding: '8px 20px', borderRadius: 9999, fontWeight: 600, fontSize: '0.82rem',
                    cursor: 'pointer', transition: 'all 0.18s', border: '1.5px solid',
                    background: isActive ? 'var(--indigo)' : 'var(--bg-card)',
                    borderColor: isActive ? 'var(--indigo)' : 'var(--border)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    boxShadow: isActive ? '0 2px 12px var(--indigo-glow)' : 'var(--shadow-sm)',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--indigo)'; e.currentTarget.style.color = 'var(--indigo)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectGrid;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Upload, Link2, Images, Check, Search, Loader2, RefreshCw } from 'lucide-react';
import { uploadToCloudinary, listCloudinaryImages, rememberUploadedImage } from '../cloudinary';
import type { CloudinaryImage } from '../cloudinary';

// Static images bundled with the project (in public/topics/)
const STATIC_IMAGES = [
  '/topics/Object_Detection_AI.jpg', '/topics/Object_Detection_AI_1.jpg',
  '/topics/image_classification.jpg', '/topics/Model_training.jpg',
  '/topics/face_recongnization.jpg', '/topics/face.jpg',
  '/topics/agentica.jpg', '/topics/chatbot1.jpg',
  '/topics/mathsolver.jpg', '/topics/language_translation.jpg',
  '/topics/text_summerization.jpg', '/topics/sentiment_analysis.jpg',
  '/topics/Full_Stack_Developer.webp', '/topics/Fontend_webdevelopment.webp',
  '/topics/Backend_development.webp',
];

interface GalleryItem { url: string; name: string; group: string; }
type Tab = 'gallery' | 'upload' | 'url';

const tabBtn = (active: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
  border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit',
  background: active ? 'var(--indigo)' : 'var(--bg-elevated)',
  color: active ? '#fff' : 'var(--text-muted)',
  transition: 'all 0.15s',
});

/* ── Main export ── */
interface ImagePickerProps {
  value: string; onChange: (url: string) => void;
  label?: string; hint?: string; mode?: 'modal' | 'inline';
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ value, onChange, label, hint, mode = 'modal' }) => {
  const [open, setOpen] = useState(false);
  if (mode === 'inline') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>}
      <PickerBody value={value} onChange={onChange} onClose={() => {}} inline />
      {hint && <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{hint}</p>}
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>}
      <button type="button" onClick={() => setOpen(true)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', background: 'var(--bg-elevated)', border: '1px solid var(--border)', transition: 'border-color 0.2s', textAlign: 'left', width: '100%' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--indigo)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
        {value ? (
          <>
            <img src={value} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0, border: '1px solid var(--border)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{value}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--indigo)', fontWeight: 600, flexShrink: 0 }}>Change</span>
          </>
        ) : (
          <>
            <div style={{ width: 48, height: 36, borderRadius: 6, background: 'var(--bg-card)', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Images size={16} style={{ color: 'var(--text-faint)' }} /></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)' }}>Click to select an image…</span>
          </>
        )}
      </button>
      {hint && <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{hint}</p>}
      {open && <PickerModal value={value} onChange={v => { onChange(v); setOpen(false); }} onClose={() => setOpen(false)} />}
    </div>
  );
};

/* ── Modal shell ── */
const PickerModal: React.FC<{ value: string; onChange: (v: string) => void; onClose: () => void }> = ({ value, onChange, onClose }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div ref={backdropRef} onClick={e => { if (e.target === backdropRef.current) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 780, maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderRadius: 18, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <p style={{ fontWeight: 800, fontSize: '1rem' }}>Select Image</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={20} /></button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <PickerBody value={value} onChange={onChange} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

/* ── Picker body ── */
const PickerBody: React.FC<{ value: string; onChange: (v: string) => void; onClose: () => void; inline?: boolean }> = ({
  value, onChange, onClose, inline = false,
}) => {
  const [tab, setTab] = useState<Tab>('gallery');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(value);
  const [urlInput, setUrlInput] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buildGallery = useCallback(async () => {
    setGalleryLoading(true);
    const cloudItems: GalleryItem[] = (await listCloudinaryImages()).map(img => ({
      url: img.url, name: img.name, group: 'Cloudinary Uploads',
    }));
    const staticItems: GalleryItem[] = STATIC_IMAGES.map(u => ({
      url: u, name: u.split('/').pop() ?? u, group: 'Built-in (topics)',
    }));
    setGallery([...cloudItems, ...staticItems]);
    setGalleryLoading(false);
  }, []);

  useEffect(() => { if (tab === 'gallery') buildGallery(); }, [tab, buildGallery]);

  const uploadFile = async (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowed.includes(file.type)) { setUploadError('Unsupported type. Use JPG, PNG, WebP or GIF.'); return; }
    setUploading(true); setUploadError('');
    try {
      const url = await uploadToCloudinary(file);
      const img: CloudinaryImage = { url, publicId: url.split('/').pop() ?? url, name: file.name };
      rememberUploadedImage(img);
      setSelected(url);
      await buildGallery();
      setTab('gallery');
    } catch (e: any) {
      setUploadError(e.message ?? 'Upload failed. Check your Cloudinary preset.');
    }
    setUploading(false);
  };

  const confirm = () => {
    const final = tab === 'url' ? urlInput.trim() : selected;
    if (final) onChange(final);
  };

  const filtered = gallery.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.group.toLowerCase().includes(search.toLowerCase())
  );
  const grouped = filtered.reduce<Record<string, GalleryItem[]>>((acc, g) => {
    (acc[g.group] ??= []).push(g); return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 22px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button style={tabBtn(tab === 'gallery')} onClick={() => setTab('gallery')}><Images size={14} />Gallery</button>
        <button style={tabBtn(tab === 'upload')} onClick={() => setTab('upload')}><Upload size={14} />Upload</button>
        <button style={tabBtn(tab === 'url')} onClick={() => setTab('url')}><Link2 size={14} />URL</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px', minHeight: 300 }}>

        {/* ── Gallery ── */}
        {tab === 'gallery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px 8px 32px', color: 'var(--text-base)', fontSize: '0.82rem', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <button onClick={buildGallery} title="Refresh" style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <RefreshCw size={14} style={{ animation: galleryLoading ? 'spin 1s linear infinite' : 'none' }} />
              </button>
            </div>
            {galleryLoading && <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--indigo)' }} /></div>}
            {Object.entries(grouped).map(([group, imgs]) => (
              <div key={group}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>📁 {group} ({imgs.length})</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                  {imgs.map(img => {
                    const isSel = selected === img.url;
                    return (
                      <div key={img.url} onClick={() => setSelected(img.url)} title={img.name}
                        style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${isSel ? 'var(--indigo)' : 'transparent'}`, aspectRatio: '1', background: 'var(--bg-elevated)', transition: 'border-color 0.15s' }}>
                        <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        {isSel && <div style={{ position: 'absolute', inset: 0, background: 'rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ background: 'var(--indigo)', borderRadius: 9999, padding: 4 }}><Check size={16} color="#fff" /></div></div>}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '3px 6px' }}>
                          <p style={{ fontSize: '0.58rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Upload ── */}
        {tab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f); }}
              onClick={() => fileInputRef.current?.click()}
              style={{ border: `2px dashed ${dragOver ? 'var(--indigo)' : 'var(--border)'}`, borderRadius: 14, padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'var(--indigo-dim)' : 'var(--bg-elevated)', transition: 'all 0.2s' }}>
              {uploading
                ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--indigo)' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /><p style={{ fontWeight: 600 }}>Uploading to Cloudinary…</p></div>
                : <><Upload size={36} style={{ color: 'var(--indigo)', margin: '0 auto 12px', display: 'block' }} /><p style={{ fontWeight: 700, color: 'var(--text-base)', marginBottom: 6 }}>Drag & drop or click to upload</p><p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>JPG, PNG, WebP, GIF — uploaded to Cloudinary CDN</p></>
              }
              <input ref={fileInputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ''; }} style={{ display: 'none' }} />
            </div>
            {uploadError && <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, color: '#f87171', fontSize: '0.82rem' }}>{uploadError}</div>}
            {selected && selected.startsWith('https://res.cloudinary.com') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
                <img src={selected} alt="" style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                <div><p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald)' }}>✓ Uploaded to Cloudinary</p><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{selected}</p></div>
              </div>
            )}
            <div style={{ padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, fontSize: '0.78rem', color: 'var(--text-faint)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-muted)' }}>Setup required:</strong> In Cloudinary → Settings → Upload → Upload presets, create an <strong>unsigned</strong> preset named <code>portfolio_unsigned</code> and set <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> in your Netlify env vars.
            </div>
          </div>
        )}

        {/* ── URL ── */}
        {tab === 'url' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Image URL</p>
              <input value={urlInput} onChange={e => { setUrlInput(e.target.value); setSelected(e.target.value); }}
                placeholder="https://res.cloudinary.com/... or /topics/image.jpg"
                style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text-base)', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => (e.target.style.borderColor = 'var(--indigo)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            {urlInput && <img src={urlInput} alt="preview" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 10, border: '1px solid var(--border)', display: 'block' }} onError={e => { (e.target as HTMLImageElement).alt = '⚠ Cannot load image'; }} />}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {selected && <><img src={selected} alt="" style={{ width: 36, height: 28, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected}</span></>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!inline && <button onClick={onClose} className="btn-ghost" style={{ padding: '9px 20px', fontSize: '0.85rem' }}>Cancel</button>}
          <button onClick={confirm} className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.85rem' }} disabled={!(tab === 'url' ? urlInput.trim() : selected)}>
            {inline ? 'Select Image' : 'Use Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Multi-image picker ── */
interface MultiImagePickerProps {
  value: string[]; onChange: (urls: string[]) => void; label?: string; hint?: string;
}
export const MultiImagePicker: React.FC<MultiImagePickerProps> = ({ value, onChange, label, hint }) => {
  const [adding, setAdding] = useState(false);
  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...value];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {value.map((url, idx) => (
            <div key={idx} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', width: 100, height: 76, background: 'var(--bg-elevated)', flexShrink: 0 }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.15s', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 4, padding: 4 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}>
                {idx > 0 && <button onClick={() => moveUp(idx)} style={{ width: 22, height: 22, borderRadius: 5, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>}
                <button onClick={() => remove(idx)} style={{ width: 22, height: 22, borderRadius: 5, background: 'rgba(248,113,113,0.85)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
              {idx === 0 && <div style={{ position: 'absolute', bottom: 2, left: 2, background: 'var(--indigo)', borderRadius: 4, padding: '1px 5px', fontSize: '0.55rem', color: '#fff', fontWeight: 700 }}>COVER</div>}
            </div>
          ))}
        </div>
      )}
      {adding ? (
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <ImagePicker value="" onChange={url => { if (url) { onChange([...value, url]); } setAdding(false); }} mode="inline" />
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
            <button onClick={() => setAdding(false)} className="btn-ghost" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="btn-ghost" style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.82rem' }}>+ Add Image</button>
      )}
      {hint && <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{hint}</p>}
    </div>
  );
};

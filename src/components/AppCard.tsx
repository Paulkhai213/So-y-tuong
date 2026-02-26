'use client';

import { useState } from 'react';
import { WebApp, Category } from '@/lib/types';
import { deleteWebApp, updateWebApp } from '@/lib/storage';
import { Globe, Star, MoreHorizontal, Trash2, ExternalLink } from 'lucide-react';

interface AppCardProps {
    app: WebApp;
    categories: Category[];
    onUpdate: (updated: WebApp) => void;
    onDelete: (id: string) => void;
}

export default function AppCard({ app, categories, onUpdate, onDelete }: AppCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const category = categories.find(c => c.id === app.category_id);

    const domain = (() => {
        try { return new URL(app.url).hostname.replace('www.', ''); } catch { return app.url; }
    })();

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const updated = updateWebApp(app.id, { is_favorite: !app.is_favorite });
        if (updated) onUpdate(updated);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(`Xoá "${app.title}"?`)) {
            deleteWebApp(app.id);
            onDelete(app.id);
        }
        setMenuOpen(false);
    };

    const handleOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        window.open(app.url, '_blank');
    };

    return (
        <div
            className="card-hover"
            style={{
                background: '#16161f',
                border: '1px solid #2a2a3a',
                borderRadius: 14,
                padding: '1.125rem',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
            }}
            onClick={handleOpen}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {/* Icon */}
                <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: '#1e1e2a',
                    border: '1px solid #2a2a3a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, overflow: 'hidden',
                }}>
                    {app.icon_url && !imgError ? (
                        <img
                            src={app.icon_url}
                            alt={app.title}
                            width={28}
                            height={28}
                            style={{ borderRadius: 6 }}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <Globe size={20} color="#55556a" />
                    )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.925rem', fontWeight: 600, color: '#e8e8f0', marginBottom: 2 }}>
                        {app.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#55556a' }}>{domain}</div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button
                        onClick={handleFavorite}
                        title={app.is_favorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: app.is_favorite ? '#f59e0b' : '#3d3d52',
                            padding: 4, display: 'flex', borderRadius: 6,
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => !app.is_favorite && ((e.currentTarget as HTMLButtonElement).style.color = '#8888aa')}
                        onMouseLeave={e => !app.is_favorite && ((e.currentTarget as HTMLButtonElement).style.color = '#3d3d52')}
                    >
                        <Star size={14} fill={app.is_favorite ? '#f59e0b' : 'none'} />
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d3d52', padding: 4, display: 'flex', borderRadius: 6, transition: 'color 0.15s' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#8888aa')}
                            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#3d3d52')}
                        >
                            <MoreHorizontal size={14} />
                        </button>
                        {menuOpen && (
                            <div
                                style={{
                                    position: 'absolute', right: 0, top: '100%', marginTop: 4,
                                    background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: 10,
                                    padding: '4px', zIndex: 10, minWidth: 130,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                                }}
                            >
                                <button
                                    onClick={e => { e.stopPropagation(); window.open(app.url, '_blank'); setMenuOpen(false); }}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#a8a8c0', borderRadius: 7, fontSize: '0.825rem' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#2a2a3a')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                >
                                    <ExternalLink size={13} /> Mở link
                                </button>
                                <button
                                    onClick={handleDelete}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', borderRadius: 7, fontSize: '0.825rem' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                >
                                    <Trash2 size={13} /> Xoá
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            {app.description && (
                <p style={{ fontSize: '0.8rem', color: '#6b6b88', lineHeight: 1.5 }}>
                    {app.description.slice(0, 80)}{app.description.length > 80 ? '...' : ''}
                </p>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {category && (
                    <span style={{
                        fontSize: '0.7rem', color: '#55556a',
                        background: '#1e1e2a', border: '1px solid #2a2a3a',
                        padding: '2px 8px', borderRadius: 9999,
                    }}>
                        {category.name}
                    </span>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#3d3d52' }}>
                    <ExternalLink size={10} />
                    Nhấn để mở
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Idea, Category, IdeaStatus } from '@/lib/types';
import { updateIdea, deleteIdea } from '@/lib/storage';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MoreHorizontal, Pencil, Trash2, Archive, Zap, Sprout, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface IdeaCardProps {
    idea: Idea;
    categories: Category[];
    onUpdate: (updated: Idea) => void;
    onDelete: (id: string) => void;
}

const STATUS_CONFIG = {
    seed: { label: 'Hạt mầm', icon: Sprout, className: 'status-seed', dotClass: 'dot-seed', next: 'active' as IdeaStatus },
    active: { label: 'Hoạt động', icon: Zap, className: 'status-active', dotClass: 'dot-active', next: 'archived' as IdeaStatus },
    archived: { label: 'Lưu trữ', icon: Archive, className: 'status-archived', dotClass: 'dot-archived', next: 'seed' as IdeaStatus },
};

export default function IdeaCard({ idea, categories, onUpdate, onDelete }: IdeaCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const status = STATUS_CONFIG[idea.status];
    const category = categories.find(c => c.id === idea.category_id);
    const timeAgo = formatDistanceToNow(new Date(idea.updated_at), { addSuffix: true, locale: vi });

    const handleStatusCycle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const updated = updateIdea(idea.id, { status: status.next });
        if (updated) onUpdate(updated);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(`Xoá ý tưởng "${idea.title}"?`)) {
            deleteIdea(idea.id);
            onDelete(idea.id);
        }
        setMenuOpen(false);
    };

    // Preview: first 120 chars of content, strip markdown
    const preview = idea.content
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 120);

    return (
        <Link href={`/ideas/${idea.id}`} style={{ textDecoration: 'none' }}>
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
                    gap: 10,
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e8e8f0', lineHeight: 1.35, flex: 1 }}>
                        {idea.title}
                    </h3>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <button
                            onClick={e => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#55556a', padding: '2px', display: 'flex', borderRadius: 6, transition: 'color 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#8888aa')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#55556a')}
                        >
                            <MoreHorizontal size={16} />
                        </button>
                        {menuOpen && (
                            <div
                                style={{
                                    position: 'absolute', right: 0, top: '100%', marginTop: 4,
                                    background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: 10,
                                    padding: '4px', zIndex: 10, minWidth: 150,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                                }}
                            >
                                <button
                                    onClick={handleStatusCycle}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#a8a8c0', borderRadius: 7, fontSize: '0.825rem' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#2a2a3a')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                >
                                    <Zap size={13} /> Chuyển → {STATUS_CONFIG[status.next].label}
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

                {/* Preview text */}
                {preview && (
                    <p style={{ fontSize: '0.8rem', color: '#6b6b88', lineHeight: 1.55, flex: 1 }}>
                        {preview}{idea.content.length > 120 ? '...' : ''}
                    </p>
                )}

                {/* Tags */}
                {idea.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {idea.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="tag-pill">#{tag}</span>
                        ))}
                        {idea.tags.length > 3 && (
                            <span className="tag-pill" style={{ color: '#55556a' }}>+{idea.tags.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                    <button
                        onClick={handleStatusCycle}
                        className={status.className}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                        <span className={status.dotClass} />
                        {status.label}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {category && (
                            <span style={{ fontSize: '0.72rem', color: '#55556a' }}>{category.name}</span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#3d3d52' }}>{timeAgo}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

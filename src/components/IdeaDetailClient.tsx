'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Sidebar from '@/components/Sidebar';
import CommandPalette from '@/components/CommandPalette';
import { Idea, Category, IdeaStatus, WebApp } from '@/lib/types';
import { getIdeaById, getCategories, getWebApps, getIdeas, updateIdea, deleteIdea } from '@/lib/storage';
import { ArrowLeft, Pencil, Trash2, Check, X, Zap, Sprout, Archive, Eye, Code2, Save } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const STATUS_CONFIG = {
    seed: { label: 'Hạt mầm', icon: Sprout, className: 'status-seed' },
    active: { label: 'Hoạt động', icon: Zap, className: 'status-active' },
    archived: { label: 'Lưu trữ', icon: Archive, className: 'status-archived' },
};

export default function IdeaDetailClient({ id }: { id: string }) {
    const router = useRouter();
    const [idea, setIdea] = useState<Idea | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [apps, setApps] = useState<WebApp[]>([]);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [commandOpen, setCommandOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editStatus, setEditStatus] = useState<IdeaStatus>('seed');
    const [editTags, setEditTags] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const found = getIdeaById(id);
        setIdea(found);
        setCategories(getCategories());
        setApps(getWebApps());
        setIdeas(getIdeas());
        setMounted(true);
    }, [id]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setCommandOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const startEdit = () => {
        if (!idea) return;
        setEditTitle(idea.title);
        setEditContent(idea.content);
        setEditStatus(idea.status);
        setEditTags(idea.tags.join(', '));
        setEditing(true);
        setPreviewMode(false);
    };

    const saveEdit = () => {
        if (!idea || !editTitle.trim()) return;
        const tags = editTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        const updated = updateIdea(idea.id, {
            title: editTitle.trim(),
            content: editContent,
            status: editStatus,
            tags,
        });
        if (updated) {
            setIdea(updated);
            setIdeas(prev => prev.map(i => i.id === updated.id ? updated : i));
        }
        setEditing(false);
    };

    const handleDelete = () => {
        if (!idea) return;
        if (confirm(`Xoá ý tưởng "${idea.title}"?`)) {
            deleteIdea(idea.id);
            router.push('/ideas');
        }
    };

    const category = categories.find(c => c.id === idea?.category_id);

    if (!mounted) return null;

    if (!idea) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar onOpenCommand={() => setCommandOpen(true)} />
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#55556a' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Không tìm thấy ý tưởng này</div>
                        <button onClick={() => router.push('/ideas')} style={{ marginTop: 16, background: '#7c6ef0', border: 'none', borderRadius: 10, color: 'white', padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}>
                            ← Quay lại
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const status = STATUS_CONFIG[idea.status];
    const timeAgo = formatDistanceToNow(new Date(idea.updated_at), { addSuffix: true, locale: vi });

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar onOpenCommand={() => setCommandOpen(true)} />

            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minWidth: 0, maxWidth: 860 }}>
                {/* Breadcrumb */}
                <button
                    onClick={() => router.push('/ideas')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#55556a', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1.5rem', padding: 0, transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#9d91f5')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#55556a')}
                >
                    <ArrowLeft size={14} /> Idea Lab
                </button>

                {/* Header */}
                <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
                    {editing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <input
                                className="input-field"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                style={{ fontSize: '1.4rem', fontWeight: 700, padding: '10px 14px' }}
                                autoFocus
                            />
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {/* Status */}
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {(['seed', 'active', 'archived'] as IdeaStatus[]).map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setEditStatus(s)}
                                            style={{
                                                padding: '5px 12px', borderRadius: 9999, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                                                border: editStatus === s ? '2px solid #7c6ef0' : '1px solid #2a2a3a',
                                                background: editStatus === s ? 'rgba(124,110,240,0.15)' : '#1e1e2a',
                                                color: editStatus === s ? '#9d91f5' : '#55556a',
                                            }}
                                        >
                                            {STATUS_CONFIG[s].label}
                                        </button>
                                    ))}
                                </div>
                                {/* Tags */}
                                <input
                                    className="input-field"
                                    placeholder="tags, phân cách bằng dấu phẩy"
                                    value={editTags}
                                    onChange={e => setEditTags(e.target.value)}
                                    style={{ flex: 1, minWidth: 200 }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e8e8f0', lineHeight: 1.3, flex: 1 }}>
                                    {idea.title}
                                </h1>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        onClick={startEdit}
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: 9, color: '#8888aa', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#3a3a52')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a3a')}
                                    >
                                        <Pencil size={13} /> Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 12px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 9, color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>

                            {/* Meta */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                                <span className={`${status.className}`} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600 }}>
                                    <status.icon size={12} /> {status.label}
                                </span>
                                {category && (
                                    <span style={{ fontSize: '0.75rem', color: '#55556a', background: '#1e1e2a', padding: '3px 10px', borderRadius: 9999, border: '1px solid #2a2a3a' }}>
                                        {category.name}
                                    </span>
                                )}
                                <span style={{ fontSize: '0.75rem', color: '#3d3d52' }}>Cập nhật {timeAgo}</span>
                            </div>

                            {/* Tags */}
                            {idea.tags.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                                    {idea.tags.map(tag => <span key={tag} className="tag-pill">#{tag}</span>)}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: '#1e1e2a', marginBottom: '1.5rem' }} />

                {/* Content editor / preview */}
                {editing ? (
                    <div>
                        {/* Edit/Preview toggle */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            <button
                                onClick={() => setPreviewMode(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: !previewMode ? 'rgba(124,110,240,0.15)' : '#1e1e2a', color: !previewMode ? '#9d91f5' : '#55556a', transition: 'all 0.15s' }}
                            >
                                <Code2 size={12} /> Chỉnh sửa
                            </button>
                            <button
                                onClick={() => setPreviewMode(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: previewMode ? 'rgba(124,110,240,0.15)' : '#1e1e2a', color: previewMode ? '#9d91f5' : '#55556a', transition: 'all 0.15s' }}
                            >
                                <Eye size={12} /> Xem trước
                            </button>
                        </div>

                        {previewMode ? (
                            <div className="markdown-content" style={{ background: '#13131c', border: '1px solid #2a2a3a', borderRadius: 12, padding: '1.25rem', minHeight: 300 }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{editContent}</ReactMarkdown>
                            </div>
                        ) : (
                            <textarea
                                className="input-field"
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                style={{ minHeight: 400, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', lineHeight: 1.7 }}
                                placeholder="Viết nội dung bằng Markdown..."
                            />
                        )}

                        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                            <button
                                onClick={() => setEditing(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: 10, color: '#8888aa', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
                            >
                                <X size={14} /> Huỷ
                            </button>
                            <button
                                onClick={saveEdit}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'linear-gradient(135deg, #7c6ef0, #9d91f5)', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(124,110,240,0.3)' }}
                            >
                                <Save size={14} /> Lưu thay đổi
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="markdown-content animate-fade-in">
                        {idea.content ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{idea.content}</ReactMarkdown>
                        ) : (
                            <div style={{ color: '#3d3d52', fontStyle: 'italic', padding: '2rem 0' }}>
                                Chưa có nội dung. <button onClick={startEdit} style={{ background: 'none', border: 'none', color: '#7c6ef0', cursor: 'pointer', fontStyle: 'normal', fontWeight: 500 }}>Nhấn chỉnh sửa</button> để thêm.
                            </div>
                        )}
                    </div>
                )}
            </main>

            {commandOpen && (
                <CommandPalette
                    apps={apps}
                    ideas={ideas}
                    onClose={() => setCommandOpen(false)}
                    onNavigate={path => router.push(path)}
                />
            )}
        </div>
    );
}

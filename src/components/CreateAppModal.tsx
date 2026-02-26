'use client';

import { useState } from 'react';
import { X, Plus, Globe, Link as LinkIcon } from 'lucide-react';
import { WebApp, Category } from '@/lib/types';
import { createWebApp, fetchFaviconAndTitle } from '@/lib/storage';

interface CreateAppModalProps {
    categories: Category[];
    onClose: () => void;
    onCreate: (app: WebApp) => void;
}

export default function CreateAppModal({ categories, onClose, onCreate }: CreateAppModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const appCategories = categories.filter(c => c.type === 'app');

    const handleUrlBlur = async () => {
        if (!url.trim()) return;
        let fixedUrl = url.trim();
        if (!fixedUrl.startsWith('http')) fixedUrl = 'https://' + fixedUrl;
        setUrl(fixedUrl);

        setFetching(true);
        const { icon_url, title: fetchedTitle } = await fetchFaviconAndTitle(fixedUrl);
        setIconUrl(icon_url);
        if (!title) setTitle(fetchedTitle);
        setFetching(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !url.trim()) return;
        setLoading(true);

        let finalIcon = iconUrl;
        if (!finalIcon && url) {
            const { icon_url } = await fetchFaviconAndTitle(url);
            finalIcon = icon_url;
        }

        const app = createWebApp({
            title: title.trim(),
            description: description.trim(),
            url: url.trim(),
            icon_url: finalIcon,
            category_id: categoryId || null,
            is_favorite: false,
        });
        onCreate(app);
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e8e8f0' }}>🌐 Thêm Web App</h2>
                        <p style={{ fontSize: '0.8rem', color: '#55556a', marginTop: 2 }}>Lưu công cụ web vào kho của bạn</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#55556a', display: 'flex', padding: 4, borderRadius: 6 }}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* URL — nhập trước để auto-fetch */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>
                            URL <span style={{ color: '#f87171' }}>*</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#3d3d52', marginLeft: 6 }}>
                                (tự động lấy favicon khi nhập xong)
                            </span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <LinkIcon size={14} color="#55556a" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                className="input-field"
                                placeholder="https://example.com"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                onBlur={handleUrlBlur}
                                required
                                style={{ paddingLeft: 36 }}
                            />
                            {fetching && (
                                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: '#9d91f5' }}>
                                    ↻ Đang lấy...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title + Icon preview */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>
                                Tiêu đề <span style={{ color: '#f87171' }}>*</span>
                            </label>
                            <input
                                className="input-field"
                                placeholder="Tên app..."
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        {/* Favicon preview */}
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: '#1e1e2a', border: '1px solid #2a2a3a',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, overflow: 'hidden',
                        }}>
                            {iconUrl ? (
                                <img src={iconUrl} alt="" width={28} height={28} style={{ borderRadius: 6 }} onError={() => setIconUrl('')} />
                            ) : (
                                <Globe size={20} color="#3d3d52" />
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>Mô tả ngắn</label>
                        <input
                            className="input-field"
                            placeholder="Dùng để làm gì..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Icon URL (manual override) */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>
                            Icon URL <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#3d3d52' }}>(tự động, có thể tuỳ chỉnh)</span>
                        </label>
                        <input
                            className="input-field"
                            placeholder="https://..."
                            value={iconUrl}
                            onChange={e => setIconUrl(e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>Danh mục</label>
                        <select
                            className="input-field"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            style={{ background: '#1e1e2a', appearance: 'none' }}
                        >
                            <option value="">— Không có —</option>
                            {appCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #2a2a3a',
                                background: 'none', color: '#8888aa', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#1e1e2a')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() || !url.trim() || loading}
                            style={{
                                flex: 2, padding: '10px', borderRadius: 10, border: 'none',
                                background: title.trim() && url.trim() ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : '#2a2a3a',
                                color: title.trim() && url.trim() ? 'white' : '#55556a',
                                cursor: title.trim() && url.trim() ? 'pointer' : 'not-allowed',
                                fontSize: '0.875rem', fontWeight: 600,
                                boxShadow: title.trim() && url.trim() ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                                transition: 'all 0.15s',
                            }}
                        >
                            🌐 Thêm vào kho
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

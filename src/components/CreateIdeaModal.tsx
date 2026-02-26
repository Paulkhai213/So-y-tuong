'use client';

import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Idea, Category, IdeaStatus } from '@/lib/types';
import { createIdea } from '@/lib/storage';

interface CreateIdeaModalProps {
    categories: Category[];
    onClose: () => void;
    onCreate: (idea: Idea) => void;
}

const STATUS_OPTIONS: { value: IdeaStatus; label: string; emoji: string }[] = [
    { value: 'seed', label: 'Hạt mầm', emoji: '🌱' },
    { value: 'active', label: 'Hoạt động', emoji: '⚡' },
    { value: 'archived', label: 'Lưu trữ', emoji: '📦' },
];

export default function CreateIdeaModal({ categories, onClose, onCreate }: CreateIdeaModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState<IdeaStatus>('seed');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const defaultContent = `## 💡 Ý tưởng\n\n\n\n### Tính năng chính\n- \n\n### Ghi chú\n`;

    const ideaCategories = categories.filter(c => c.type === 'idea');

    const addTag = () => {
        const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
        if (t && !tags.includes(t)) {
            setTags([...tags, t]);
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        const idea = createIdea({
            title: title.trim(),
            content: content || defaultContent,
            category_id: categoryId || null,
            status,
            tags,
        });
        onCreate(idea);
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e8e8f0' }}>✨ Ý tưởng mới</h2>
                        <p style={{ fontSize: '0.8rem', color: '#55556a', marginTop: 2 }}>Ghi lại ý tưởng trước khi quên</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#55556a', display: 'flex', padding: 4, borderRadius: 6 }}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>
                            Tiêu đề <span style={{ color: '#f87171' }}>*</span>
                        </label>
                        <input
                            className="input-field"
                            placeholder="Tên ý tưởng..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    {/* Status + Category row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>Trạng thái</label>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {STATUS_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setStatus(opt.value)}
                                        style={{
                                            flex: 1, padding: '6px 4px', borderRadius: 8, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                                            border: status === opt.value ? '2px solid #7c6ef0' : '1px solid #2a2a3a',
                                            background: status === opt.value ? 'rgba(124,110,240,0.15)' : '#1e1e2a',
                                            color: status === opt.value ? '#9d91f5' : '#55556a',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {opt.emoji}
                                    </button>
                                ))}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#55556a', marginTop: 4, textAlign: 'center' }}>
                                {STATUS_OPTIONS.find(o => o.value === status)?.label}
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>Danh mục</label>
                            <select
                                className="input-field select"
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                style={{ background: '#1e1e2a', appearance: 'none' }}
                            >
                                <option value="">— Không có —</option>
                                {ideaCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>Tags</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                className="input-field"
                                placeholder="thêm tag rồi nhấn Enter..."
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                                style={{ flex: 1 }}
                            />
                            <button type="button" onClick={addTag} style={{ background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: 10, padding: '0 12px', cursor: 'pointer', color: '#9d91f5', display: 'flex', alignItems: 'center' }}>
                                <Plus size={16} />
                            </button>
                        </div>
                        {tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                                {tags.map(tag => (
                                    <span key={tag} className="tag-pill" style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)}>
                                        #{tag} <X size={10} />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#8888aa', marginBottom: 6 }}>
                            Nội dung <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#3d3d52' }}>(Markdown)</span>
                        </label>
                        <textarea
                            className="input-field"
                            placeholder={defaultContent}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={7}
                        />
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
                            disabled={!title.trim()}
                            style={{
                                flex: 2, padding: '10px', borderRadius: 10, border: 'none',
                                background: title.trim() ? 'linear-gradient(135deg, #7c6ef0, #9d91f5)' : '#2a2a3a',
                                color: title.trim() ? 'white' : '#55556a',
                                cursor: title.trim() ? 'pointer' : 'not-allowed',
                                fontSize: '0.875rem', fontWeight: 600,
                                boxShadow: title.trim() ? '0 4px 16px rgba(124,110,240,0.3)' : 'none',
                                transition: 'all 0.15s',
                            }}
                        >
                            ✨ Tạo ý tưởng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

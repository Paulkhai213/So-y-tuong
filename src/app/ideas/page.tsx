'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import CommandPalette from '@/components/CommandPalette';
import IdeaCard from '@/components/IdeaCard';
import CreateIdeaModal from '@/components/CreateIdeaModal';
import { Idea, Category, IdeaStatus } from '@/lib/types';
import { getIdeas, getWebApps, getCategories, initSeedData } from '@/lib/storage';
import { Plus, Search, Filter, Lightbulb } from 'lucide-react';
import { WebApp } from '@/lib/types';

const STATUS_FILTERS: { value: IdeaStatus | 'all'; label: string; emoji: string }[] = [
    { value: 'all', label: 'Tất cả', emoji: '✶' },
    { value: 'seed', label: 'Hạt mầm', emoji: '🌱' },
    { value: 'active', label: 'Hoạt động', emoji: '⚡' },
    { value: 'archived', label: 'Lưu trữ', emoji: '📦' },
];

export default function IdeasPage() {
    const router = useRouter();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [apps, setApps] = useState<WebApp[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [commandOpen, setCommandOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<IdeaStatus | 'all'>('all');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        initSeedData();
        setIdeas(getIdeas());
        setApps(getWebApps());
        setCategories(getCategories());
        setMounted(true);
    }, []);

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

    const filtered = ideas.filter(idea => {
        const matchStatus = statusFilter === 'all' || idea.status === statusFilter;
        const matchSearch = !search || idea.title.toLowerCase().includes(search.toLowerCase()) || idea.tags.some(t => t.includes(search.toLowerCase()));
        return matchStatus && matchSearch;
    });

    if (!mounted) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar onOpenCommand={() => setCommandOpen(true)} />

            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minWidth: 0 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: 'rgba(124,110,240,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Lightbulb size={18} color="#9d91f5" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e8e8f0' }}>Idea Lab</h1>
                            <p style={{ fontSize: '0.75rem', color: '#55556a' }}>{ideas.length} ý tưởng</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setCreateOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
                            background: 'linear-gradient(135deg, #7c6ef0, #9d91f5)',
                            border: 'none', borderRadius: 10, color: 'white',
                            fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(124,110,240,0.3)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        <Plus size={16} /> Ý tưởng mới
                    </button>
                </div>

                {/* Filters bar */}
                <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={14} color="#55556a" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            className="input-field"
                            placeholder="Tìm theo tiêu đề hoặc tag..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: 36 }}
                        />
                    </div>

                    {/* Status filter pills */}
                    <div style={{ display: 'flex', gap: 6 }}>
                        {STATUS_FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setStatusFilter(f.value)}
                                style={{
                                    padding: '6px 14px', borderRadius: 9999, border: 'none', cursor: 'pointer',
                                    fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
                                    background: statusFilter === f.value ? 'rgba(124,110,240,0.2)' : '#16161f',
                                    color: statusFilter === f.value ? '#9d91f5' : '#55556a',
                                    boxShadow: statusFilter === f.value ? '0 0 0 1px rgba(124,110,240,0.4)' : '0 0 0 1px #2a2a3a',
                                }}
                            >
                                {f.emoji} {f.label}
                                {f.value !== 'all' && (
                                    <span style={{ marginLeft: 4, fontSize: '0.7rem', opacity: 0.7 }}>
                                        {ideas.filter(i => i.status === f.value).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div style={{
                        border: '1.5px dashed #2a2a3a', borderRadius: 14, padding: '3rem',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#6b6b88', marginBottom: 6 }}>
                            {search ? `Không tìm thấy kết quả cho "${search}"` : 'Chưa có ý tưởng nào'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#3d3d52' }}>
                            {search ? 'Hãy thử tìm với từ khoá khác' : 'Nhấn \'Ý tưởng mới\' để bắt đầu nhé!'}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                        {filtered.map((idea, i) => (
                            <div key={idea.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                                <IdeaCard
                                    idea={idea}
                                    categories={categories}
                                    onUpdate={updated => setIdeas(prev => prev.map(i => i.id === updated.id ? updated : i))}
                                    onDelete={id => setIdeas(prev => prev.filter(i => i.id !== id))}
                                />
                            </div>
                        ))}
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
            {createOpen && (
                <CreateIdeaModal
                    categories={categories}
                    onClose={() => setCreateOpen(false)}
                    onCreate={idea => setIdeas(prev => [idea, ...prev])}
                />
            )}
        </div>
    );
}

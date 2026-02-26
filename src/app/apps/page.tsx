'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import CommandPalette from '@/components/CommandPalette';
import AppCard from '@/components/AppCard';
import CreateAppModal from '@/components/CreateAppModal';
import { WebApp, Category, Idea } from '@/lib/types';
import { getWebApps, getIdeas, getCategories, initSeedData } from '@/lib/storage';
import { Plus, Search, Globe, Star, LayoutGrid } from 'lucide-react';

export default function AppsPage() {
    const router = useRouter();
    const [apps, setApps] = useState<WebApp[]>([]);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [commandOpen, setCommandOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filterFav, setFilterFav] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        initSeedData();
        setApps(getWebApps());
        setIdeas(getIdeas());
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

    const appCategories = categories.filter(c => c.type === 'app');

    const filtered = apps.filter(app => {
        const matchSearch = !search ||
            app.title.toLowerCase().includes(search.toLowerCase()) ||
            app.description.toLowerCase().includes(search.toLowerCase());
        const matchFav = !filterFav || app.is_favorite;
        const matchCat = !selectedCategory || app.category_id === selectedCategory;
        return matchSearch && matchFav && matchCat;
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
                            background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Globe size={18} color="#3b82f6" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e8e8f0' }}>App Vault</h1>
                            <p style={{ fontSize: '0.75rem', color: '#55556a' }}>{apps.length} công cụ · {apps.filter(a => a.is_favorite).length} yêu thích</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setCreateOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            border: 'none', borderRadius: 10, color: 'white',
                            fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(59,130,246,0.25)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        <Plus size={16} /> Thêm App
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={14} color="#55556a" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            className="input-field"
                            placeholder="Tìm app..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: 36 }}
                        />
                    </div>

                    {/* Favorite filter */}
                    <button
                        onClick={() => setFilterFav(!filterFav)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                            background: filterFav ? 'rgba(245,158,11,0.12)' : '#16161f',
                            border: filterFav ? '1px solid rgba(245,158,11,0.3)' : '1px solid #2a2a3a',
                            borderRadius: 10, cursor: 'pointer',
                            color: filterFav ? '#f59e0b' : '#55556a',
                            fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
                        }}
                    >
                        <Star size={13} fill={filterFav ? '#f59e0b' : 'none'} />
                        Yêu thích
                    </button>

                    {/* Category filter */}
                    {appCategories.length > 0 && (
                        <select
                            className="input-field"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            style={{ background: '#16161f', appearance: 'none', width: 'auto', minWidth: 140 }}
                        >
                            <option value="">Tất cả danh mục</option>
                            {appCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div style={{ border: '1.5px dashed #2a2a3a', borderRadius: 14, padding: '3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌐</div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#6b6b88', marginBottom: 6 }}>
                            {search ? `Không tìm thấy "${search}"` : 'Chưa có app nào'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#3d3d52' }}>
                            {search ? 'Thử từ khoá khác' : 'Nhấn \'Thêm App\' để thêm công cụ đầu tiên'}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                        {filtered.map((app, i) => (
                            <div key={app.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                                <AppCard
                                    app={app}
                                    categories={categories}
                                    onUpdate={updated => setApps(prev => prev.map(a => a.id === updated.id ? updated : a))}
                                    onDelete={id => setApps(prev => prev.filter(a => a.id !== id))}
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
                <CreateAppModal
                    categories={categories}
                    onClose={() => setCreateOpen(false)}
                    onCreate={app => setApps(prev => [app, ...prev])}
                />
            )}
        </div>
    );
}

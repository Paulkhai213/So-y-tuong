'use client';
// Trigger new build

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import CommandPalette from '@/components/CommandPalette';
import IdeaCard from '@/components/IdeaCard';
import AppCard from '@/components/AppCard';
import CreateIdeaModal from '@/components/CreateIdeaModal';
import CreateAppModal from '@/components/CreateAppModal';
import { Idea, WebApp, Category } from '@/lib/types';
import { getIdeas, getWebApps, getCategories, initSeedData } from '@/lib/storage';
import { Plus, Lightbulb, Globe, Zap, TrendingUp, Star, Sprout } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [apps, setApps] = useState<WebApp[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [createIdeaOpen, setCreateIdeaOpen] = useState(false);
  const [createAppOpen, setCreateAppOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Chào buổi sáng ☀️';
    if (h >= 12 && h < 18) return 'Chào buổi chiều 🌞';
    if (h >= 18 && h < 22) return 'Chào buổi tối 🌙';
    return 'Chào buổi đêm 🌚';
  })();

  useEffect(() => {
    initSeedData();
    setIdeas(getIdeas());
    setApps(getWebApps());
    setCategories(getCategories());
    setMounted(true);
  }, []);

  // Global keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const stats = {
    total: ideas.length,
    active: ideas.filter(i => i.status === 'active').length,
    seed: ideas.filter(i => i.status === 'seed').length,
    apps: apps.length,
  };

  const recentIdeas = ideas.slice(0, 4);
  const favoriteApps = apps.filter(a => a.is_favorite).slice(0, 4);
  const recentApps = apps.slice(0, 4);

  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onOpenCommand={() => setCommandOpen(true)} />

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minWidth: 0 }}>
        {/* Header */}
        <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e8e8f0', marginBottom: 4 }}>
                {greeting}
              </h1>
              <p style={{ color: '#55556a', fontSize: '0.9rem' }}>
                Bạn có <strong style={{ color: '#9d91f5' }}>{stats.active}</strong> ý tưởng đang hoạt động và <strong style={{ color: '#3b82f6' }}>{stats.apps}</strong> công cụ trong kho.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setCreateIdeaOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px',
                  background: 'linear-gradient(135deg, #7c6ef0, #9d91f5)',
                  border: 'none', borderRadius: 10, color: 'white',
                  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(124,110,240,0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Plus size={16} /> Ý tưởng
              </button>
              <button
                onClick={() => setCreateAppOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  border: 'none', borderRadius: 10, color: 'white',
                  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(59,130,246,0.25)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Plus size={16} /> Web App
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: '2rem' }}>
          {[
            { label: 'Tổng ý tưởng', value: stats.total, icon: Lightbulb, color: '#9d91f5', bg: 'rgba(124,110,240,0.1)' },
            { label: 'Đang hoạt động', value: stats.active, icon: Zap, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'Hạt mầm mới', value: stats.seed, icon: Sprout, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Web Apps', value: stats.apps, icon: Globe, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="animate-fade-in"
              style={{
                background: '#16161f', border: '1px solid #2a2a3a', borderRadius: 14,
                padding: '1.125rem', display: 'flex', alignItems: 'center', gap: 14,
                animationDelay: `${i * 60}ms`,
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#55556a', marginTop: 3 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Two columns: Recent Ideas + Favorite Apps */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Recent Ideas */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lightbulb size={16} color="#9d91f5" />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e8e8f0' }}>Ý tưởng gần đây</h2>
              </div>
              <button
                onClick={() => router.push('/ideas')}
                style={{ fontSize: '0.75rem', color: '#7c6ef0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Xem tất cả →
              </button>
            </div>
            {recentIdeas.length === 0 ? (
              <EmptyState icon="💡" text="Chưa có ý tưởng nào" sub="Nhấn + để tạo ý tưởng đầu tiên" onAction={() => setCreateIdeaOpen(true)} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentIdeas.map(idea => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    categories={categories}
                    onUpdate={updated => setIdeas(prev => prev.map(i => i.id === updated.id ? updated : i))}
                    onDelete={id => setIdeas(prev => prev.filter(i => i.id !== id))}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Favorite / Recent Apps */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e8e8f0' }}>Apps yêu thích</h2>
              </div>
              <button
                onClick={() => router.push('/apps')}
                style={{ fontSize: '0.75rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Xem tất cả →
              </button>
            </div>
            {(favoriteApps.length > 0 ? favoriteApps : recentApps).length === 0 ? (
              <EmptyState icon="🌐" text="Chưa có app nào" sub="Nhấn + để thêm công cụ đầu tiên" onAction={() => setCreateAppOpen(true)} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(favoriteApps.length > 0 ? favoriteApps : recentApps).map(app => (
                  <AppCard
                    key={app.id}
                    app={app}
                    categories={categories}
                    onUpdate={updated => setApps(prev => prev.map(a => a.id === updated.id ? updated : a))}
                    onDelete={id => setApps(prev => prev.filter(a => a.id !== id))}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Overlays */}
      {commandOpen && (
        <CommandPalette
          apps={apps}
          ideas={ideas}
          onClose={() => setCommandOpen(false)}
          onNavigate={path => router.push(path)}
        />
      )}
      {createIdeaOpen && (
        <CreateIdeaModal
          categories={categories}
          onClose={() => setCreateIdeaOpen(false)}
          onCreate={idea => setIdeas(prev => [idea, ...prev])}
        />
      )}
      {createAppOpen && (
        <CreateAppModal
          categories={categories}
          onClose={() => setCreateAppOpen(false)}
          onCreate={app => setApps(prev => [app, ...prev])}
        />
      )}
    </div>
  );
}

function EmptyState({ icon, text, sub, onAction }: { icon: string; text: string; sub: string; onAction: () => void }) {
  return (
    <div
      onClick={onAction}
      style={{
        border: '1.5px dashed #2a2a3a', borderRadius: 14, padding: '2rem',
        textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#3a3a52';
        (e.currentTarget as HTMLDivElement).style.background = '#16161f';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a3a';
        (e.currentTarget as HTMLDivElement).style.background = 'none';
      }}
    >
      <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b6b88', marginBottom: 4 }}>{text}</div>
      <div style={{ fontSize: '0.75rem', color: '#3d3d52' }}>{sub}</div>
    </div>
  );
}

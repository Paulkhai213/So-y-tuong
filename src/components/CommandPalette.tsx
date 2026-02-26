'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Globe, Lightbulb, ArrowRight, CornerDownLeft, X, Zap } from 'lucide-react';
import { WebApp, Idea } from '@/lib/types';

interface CommandPaletteProps {
    apps: WebApp[];
    ideas: Idea[];
    onClose: () => void;
    onNavigate: (path: string) => void;
}

interface CommandItem {
    id: string;
    type: 'app' | 'idea' | 'action';
    label: string;
    sublabel?: string;
    icon_url?: string;
    url?: string;
    path?: string;
}

export default function CommandPalette({ apps, ideas, onClose, onNavigate }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);
    const [redirecting, setRedirecting] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const allItems: CommandItem[] = [
        ...apps.map(app => ({
            id: app.id,
            type: 'app' as const,
            label: app.title,
            sublabel: app.description || app.url,
            icon_url: app.icon_url,
            url: app.url,
        })),
        ...ideas.map(idea => ({
            id: idea.id,
            type: 'idea' as const,
            label: idea.title,
            sublabel: idea.status === 'seed' ? '🌱 Hạt mầm' : idea.status === 'active' ? '⚡ Hoạt động' : '📦 Lưu trữ',
            path: `/ideas/detail?id=${idea.id}`,
        })),
    ];

    const filtered = query.trim() === ''
        ? allItems.slice(0, 8)
        : allItems.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.sublabel?.toLowerCase().includes(query.toLowerCase())
        );

    // Quick redirect: nếu chỉ có 1 app trùng khớp CHÍNH XÁC → auto redirect
    useEffect(() => {
        if (query.trim().length < 2) return;
        const exactMatches = apps.filter(app =>
            app.title.toLowerCase() === query.trim().toLowerCase()
        );
        if (exactMatches.length === 1 && exactMatches[0].url) {
            setRedirecting(exactMatches[0].title);
            const timer = setTimeout(() => {
                window.open(exactMatches[0].url, '_blank');
                onClose();
            }, 600);
            return () => clearTimeout(timer);
        } else {
            setRedirecting(null);
        }
    }, [query, apps, onClose]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelected(s => Math.min(s + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelected(s => Math.max(s - 1, 0));
        } else if (e.key === 'Enter') {
            const item = filtered[selected];
            if (!item) return;
            if (item.type === 'app' && item.url) {
                window.open(item.url, '_blank');
                onClose();
            } else if (item.path) {
                onNavigate(item.path);
                onClose();
            }
        }
    }, [filtered, selected, onClose, onNavigate]);

    useEffect(() => {
        setSelected(0);
    }, [query]);

    // Scroll selected item into view
    useEffect(() => {
        const el = listRef.current?.children[selected] as HTMLElement | undefined;
        el?.scrollIntoView({ block: 'nearest' });
    }, [selected]);

    return (
        <div className="command-overlay" onClick={onClose}>
            <div
                className="animate-slide-down"
                style={{
                    width: '100%',
                    maxWidth: '580px',
                    background: '#13131c',
                    border: '1px solid #2a2a3a',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 32px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,110,240,0.1)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Search input */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #1e1e2a', gap: 12 }}>
                    {redirecting ? (
                        <Zap size={18} color="#f59e0b" style={{ flexShrink: 0, animation: 'pulse 0.5s infinite' }} />
                    ) : (
                        <Search size={18} color="#55556a" style={{ flexShrink: 0 }} />
                    )}
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tìm app, ý tưởng... (Enter để mở)"
                        style={{
                            flex: 1,
                            background: 'none',
                            border: 'none',
                            outline: 'none',
                            color: '#e8e8f0',
                            fontSize: '1rem',
                        }}
                    />
                    {query && (
                        <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#55556a', display: 'flex' }}>
                            <X size={16} />
                        </button>
                    )}
                    <kbd style={{
                        background: '#1e1e2a',
                        border: '1px solid #2a2a3a',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        color: '#55556a',
                        fontFamily: 'monospace',
                    }}>ESC</kbd>
                </div>

                {/* Redirecting indicator */}
                {redirecting && (
                    <div style={{
                        padding: '10px 16px',
                        background: 'rgba(245, 158, 11, 0.08)',
                        borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}>
                        <div style={{
                            width: 6, height: 6, borderRadius: '50%', background: '#f59e0b',
                            animation: 'pulse 0.6s infinite',
                        }} />
                        <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>
                            Đang mở <strong>{redirecting}</strong>...
                        </span>
                    </div>
                )}

                {/* Results */}
                <div ref={listRef} style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
                    {filtered.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#55556a', fontSize: '0.875rem' }}>
                            Không tìm thấy kết quả nào cho "<strong style={{ color: '#8888aa' }}>{query}</strong>"
                        </div>
                    ) : (
                        <>
                            {/* Group label */}
                            {query.trim() === '' && (
                                <div style={{ padding: '4px 8px 6px', fontSize: '0.7rem', color: '#55556a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Gần đây
                                </div>
                            )}
                            {filtered.map((item, idx) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.type === 'app' && item.url) {
                                            window.open(item.url, '_blank');
                                            onClose();
                                        } else if (item.path) {
                                            onNavigate(item.path);
                                            onClose();
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        padding: '10px 12px',
                                        borderRadius: 10,
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: idx === selected ? 'rgba(124,110,240,0.12)' : 'transparent',
                                        color: idx === selected ? '#e8e8f0' : '#a8a8c0',
                                        textAlign: 'left',
                                        transition: 'all 0.1s ease',
                                    }}
                                    onMouseEnter={() => setSelected(idx)}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: item.type === 'app' ? '#1e1e2a' : 'rgba(124,110,240,0.12)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, overflow: 'hidden',
                                        border: '1px solid #2a2a3a',
                                    }}>
                                        {item.type === 'app' && item.icon_url ? (
                                            <img src={item.icon_url} alt="" width={20} height={20} style={{ borderRadius: 4 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                        ) : item.type === 'app' ? (
                                            <Globe size={14} color="#8888aa" />
                                        ) : (
                                            <Lightbulb size={14} color="#9d91f5" />
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.label}
                                        </div>
                                        {item.sublabel && (
                                            <div style={{ fontSize: '0.75rem', color: '#55556a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.sublabel}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right hint */}
                                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {item.type === 'app' ? (
                                            <span style={{ fontSize: '0.7rem', color: '#55556a', background: '#1e1e2a', border: '1px solid #2a2a3a', padding: '1px 6px', borderRadius: 4 }}>Ứng dụng</span>
                                        ) : (
                                            <span style={{ fontSize: '0.7rem', color: '#9d91f5', background: 'rgba(124,110,240,0.08)', border: '1px solid rgba(124,110,240,0.15)', padding: '1px 6px', borderRadius: 4 }}>Ý tưởng</span>
                                        )}
                                        {idx === selected && <CornerDownLeft size={12} color="#55556a" />}
                                    </div>
                                </button>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer hints */}
                <div style={{
                    padding: '10px 16px',
                    borderTop: '1px solid #1e1e2a',
                    display: 'flex',
                    gap: 20,
                    alignItems: 'center',
                }}>
                    {[
                        { key: '↑↓', label: 'điều hướng' },
                        { key: '↵', label: 'mở' },
                        { key: 'Esc', label: 'đóng' },
                    ].map(hint => (
                        <span key={hint.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', color: '#55556a' }}>
                            <kbd style={{ background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: 4, padding: '1px 6px', fontFamily: 'monospace', fontSize: '0.7rem', color: '#8888aa' }}>
                                {hint.key}
                            </kbd>
                            {hint.label}
                        </span>
                    ))}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#55556a' }}>
                        <Zap size={10} color="#7c6ef0" />
                        Chuyển hướng tự động khi tìm thấy 1 kết quả khớp chính xác
                    </div>
                </div>
            </div>
        </div>
    );
}

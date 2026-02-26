'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lightbulb, Globe, LayoutDashboard, Search, Command } from 'lucide-react';

interface SidebarProps {
    onOpenCommand: () => void;
}

const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/ideas', icon: Lightbulb, label: 'Idea Lab' },
    { href: '/apps', icon: Globe, label: 'App Vault' },
];

export default function Sidebar({ onOpenCommand }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside style={{
            width: 220,
            flexShrink: 0,
            height: '100vh',
            position: 'sticky',
            top: 0,
            background: '#0d0d15',
            borderRight: '1px solid #1e1e2a',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.25rem 1rem',
            gap: '0.25rem',
        }}>
            {/* Logo */}
            <div style={{ padding: '0.25rem 0.5rem 1.25rem', marginBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 9,
                        background: 'linear-gradient(135deg, #7c6ef0, #c084fc)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(124,110,240,0.3)',
                    }}>
                        <Lightbulb size={16} color="white" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e8e8f0', lineHeight: 1.1 }}>Sổ Ý Tưởng</div>
                        <div style={{ fontSize: '0.65rem', color: '#55556a', fontWeight: 500 }}>Không gian cá nhân</div>
                    </div>
                </div>
            </div>

            {/* Quick Search button */}
            <button
                onClick={onOpenCommand}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: '#1a1a25',
                    border: '1px solid #2a2a3a',
                    borderRadius: 10,
                    color: '#55556a',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    marginBottom: '0.75rem',
                    transition: 'all 0.15s ease',
                    width: '100%',
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#3a3a52';
                    (e.currentTarget as HTMLButtonElement).style.color = '#8888aa';
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a3a';
                    (e.currentTarget as HTMLButtonElement).style.color = '#55556a';
                }}
            >
                <Search size={13} />
                <span style={{ flex: 1, textAlign: 'left' }}>Tìm kiếm...</span>
                <div style={{ display: 'flex', gap: 2 }}>
                    <kbd style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 4, padding: '0px 5px', fontSize: '0.65rem', fontFamily: 'monospace', color: '#55556a' }}>⌃</kbd>
                    <kbd style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 4, padding: '0px 5px', fontSize: '0.65rem', fontFamily: 'monospace', color: '#55556a' }}>K</kbd>
                </div>
            </button>

            {/* Section label */}
            <div style={{ fontSize: '0.65rem', color: '#55556a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem', marginBottom: '0.25rem' }}>
                Điều hướng
            </div>

            {/* Nav items */}
            {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`nav-link ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={16} />
                        {label}
                    </Link>
                );
            })}

            {/* Bottom: keyboard shortcut reminder */}
            <div style={{ marginTop: 'auto', padding: '0.75rem', background: 'rgba(124,110,240,0.06)', border: '1px solid rgba(124,110,240,0.1)', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Command size={11} color="#7c6ef0" />
                    <span style={{ fontSize: '0.7rem', color: '#7c6ef0', fontWeight: 600 }}>Lệnh nhanh</span>
                </div>
                <p style={{ fontSize: '0.65rem', color: '#55556a', lineHeight: 1.5 }}>
                    Nhấn <kbd style={{ background: '#1e1e2a', padding: '0 4px', borderRadius: 3, fontFamily: 'monospace', color: '#9d91f5' }}>Ctrl+K</kbd> để mở thanh tìm kiếm nhanh
                </p>
            </div>
        </aside>
    );
}

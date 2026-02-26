import { Idea, WebApp, Category, IdeaStatus } from './types';

const KEYS = {
    ideas: 'syt_ideas',
    apps: 'syt_apps',
    categories: 'syt_categories',
};

function generateId(): string {
    return crypto.randomUUID();
}

function now(): string {
    return new Date().toISOString();
}

// --- Categories ---
export function getCategories(): Category[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(KEYS.categories);
    return raw ? JSON.parse(raw) : [];
}

export function saveCategories(cats: Category[]): void {
    localStorage.setItem(KEYS.categories, JSON.stringify(cats));
}

export function createCategory(data: Omit<Category, 'id' | 'created_at'>): Category {
    const cat: Category = { ...data, id: generateId(), created_at: now() };
    const all = getCategories();
    saveCategories([...all, cat]);
    return cat;
}

export function deleteCategory(id: string): void {
    saveCategories(getCategories().filter(c => c.id !== id));
}

// --- Ideas ---
export function getIdeas(): Idea[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(KEYS.ideas);
    return raw ? JSON.parse(raw) : [];
}

export function saveIdeas(ideas: Idea[]): void {
    localStorage.setItem(KEYS.ideas, JSON.stringify(ideas));
}

export function createIdea(data: Omit<Idea, 'id' | 'created_at' | 'updated_at'>): Idea {
    const idea: Idea = { ...data, id: generateId(), created_at: now(), updated_at: now() };
    const all = getIdeas();
    saveIdeas([idea, ...all]);
    return idea;
}

export function updateIdea(id: string, data: Partial<Omit<Idea, 'id' | 'created_at'>>): Idea | null {
    const all = getIdeas();
    const idx = all.findIndex(i => i.id === id);
    if (idx === -1) return null;
    const updated = { ...all[idx], ...data, updated_at: now() };
    all[idx] = updated;
    saveIdeas(all);
    return updated;
}

export function deleteIdea(id: string): void {
    saveIdeas(getIdeas().filter(i => i.id !== id));
}

export function getIdeaById(id: string): Idea | null {
    return getIdeas().find(i => i.id === id) ?? null;
}

// --- Web Apps ---
export function getWebApps(): WebApp[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(KEYS.apps);
    return raw ? JSON.parse(raw) : [];
}

export function saveWebApps(apps: WebApp[]): void {
    localStorage.setItem(KEYS.apps, JSON.stringify(apps));
}

export function createWebApp(data: Omit<WebApp, 'id' | 'created_at' | 'updated_at'>): WebApp {
    const app: WebApp = { ...data, id: generateId(), created_at: now(), updated_at: now() };
    const all = getWebApps();
    saveWebApps([app, ...all]);
    return app;
}

export function updateWebApp(id: string, data: Partial<Omit<WebApp, 'id' | 'created_at'>>): WebApp | null {
    const all = getWebApps();
    const idx = all.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const updated = { ...all[idx], ...data, updated_at: now() };
    all[idx] = updated;
    saveWebApps(all);
    return updated;
}

export function deleteWebApp(id: string): void {
    saveWebApps(getWebApps().filter(a => a.id !== id));
}

export function getWebAppById(id: string): WebApp | null {
    return getWebApps().find(a => a.id === id) ?? null;
}

// --- Seed Data (chỉ chạy lần đầu) ---
export function initSeedData(): void {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('syt_seeded')) return;

    const cats: Category[] = [
        { id: generateId(), name: 'Công nghệ', type: 'idea', color: '#6366f1', created_at: now() },
        { id: generateId(), name: 'Kinh doanh', type: 'idea', color: '#f59e0b', created_at: now() },
        { id: generateId(), name: 'Sáng tạo', type: 'idea', color: '#10b981', created_at: now() },
        { id: generateId(), name: 'Năng suất', type: 'app', color: '#3b82f6', created_at: now() },
        { id: generateId(), name: 'Thiết kế', type: 'app', color: '#ec4899', created_at: now() },
        { id: generateId(), name: 'Lập trình', type: 'app', color: '#8b5cf6', created_at: now() },
    ];
    saveCategories(cats);

    const ideaCats = cats.filter(c => c.type === 'idea');
    const ideas: Idea[] = [
        {
            id: generateId(),
            title: 'Ứng dụng quản lý thói quen cá nhân',
            content: '## 💡 Ý tưởng\n\nXây dựng app theo dõi thói quen hàng ngày với yếu tố **gamification**.\n\n### Tính năng chính\n- 🔥 Streak tracking\n- ⏰ Reminder thông minh\n- 📊 Báo cáo tiến độ hàng tuần\n- 🎯 Đặt mục tiêu SMART\n\n### Tech Stack\n- React Native / Flutter\n- Supabase backend\n- Push notifications',
            category_id: ideaCats[0]?.id ?? null,
            status: 'active',
            tags: ['app', 'productivity', 'mobile'],
            created_at: now(),
            updated_at: now(),
        },
        {
            id: generateId(),
            title: 'Blog kỹ thuật cá nhân',
            content: '## 🎯 Mục tiêu\n\nViết blog chia sẻ kiến thức lập trình và kinh nghiệm thực tế mỗi tuần.\n\n### Chủ đề dự kiến\n- Next.js tips & tricks\n- System design patterns\n- Career advice cho developer\n\n### Platform\nDùng **Next.js** + **MDX** hosting trên Vercel.',
            category_id: ideaCats[1]?.id ?? null,
            status: 'seed',
            tags: ['blog', 'writing', 'dev'],
            created_at: now(),
            updated_at: now(),
        },
        {
            id: generateId(),
            title: 'CLI tool tự động hoá commit message',
            content: '## 🔧 Vấn đề\n\nCommit message thường không nhất quán và tốn thời gian suy nghĩ.\n\n## ✅ Giải pháp\n\nTạo CLI dùng AI (OpenAI API) để tự động generate commit message từ git diff.\n\n```bash\ngit add .\nauto-commit  # ✨ Magic!\n```',
            category_id: ideaCats[0]?.id ?? null,
            status: 'archived',
            tags: ['cli', 'git', 'automation', 'ai'],
            created_at: now(),
            updated_at: now(),
        },
        {
            id: generateId(),
            title: 'Pomodoro timer tích hợp Spotify',
            content: '## 🍅 Concept\n\nMột Pomodoro timer thông minh có thể tự động:\n- Phát nhạc focus khi làm việc\n- Tắt nhạc khi nghỉ\n- Gợi ý playlist phù hợp\n\n## APIs cần dùng\n- Spotify Web API\n- Browser Notification API',
            category_id: ideaCats[2]?.id ?? null,
            status: 'seed',
            tags: ['productivity', 'music', 'focus'],
            created_at: now(),
            updated_at: now(),
        },
    ];
    saveIdeas(ideas);

    const apps: WebApp[] = [
        { id: generateId(), title: 'Linear', description: 'Quản lý task và dự án cho team', url: 'https://linear.app', icon_url: 'https://www.google.com/s2/favicons?domain=linear.app&sz=64', category_id: cats[3]?.id ?? null, is_favorite: true, created_at: now(), updated_at: now() },
        { id: generateId(), title: 'Figma', description: 'Thiết kế UI/UX và prototype', url: 'https://figma.com', icon_url: 'https://www.google.com/s2/favicons?domain=figma.com&sz=64', category_id: cats[4]?.id ?? null, is_favorite: true, created_at: now(), updated_at: now() },
        { id: generateId(), title: 'Notion', description: 'All-in-one workspace và notes', url: 'https://notion.so', icon_url: 'https://www.google.com/s2/favicons?domain=notion.so&sz=64', category_id: cats[3]?.id ?? null, is_favorite: false, created_at: now(), updated_at: now() },
        { id: generateId(), title: 'GitHub', description: 'Code hosting và version control', url: 'https://github.com', icon_url: 'https://www.google.com/s2/favicons?domain=github.com&sz=64', category_id: cats[5]?.id ?? null, is_favorite: true, created_at: now(), updated_at: now() },
        { id: generateId(), title: 'Vercel', description: 'Deploy và hosting Next.js apps', url: 'https://vercel.com', icon_url: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=64', category_id: cats[5]?.id ?? null, is_favorite: false, created_at: now(), updated_at: now() },
        { id: generateId(), title: 'Supabase', description: 'PostgreSQL backend as a Service', url: 'https://supabase.com', icon_url: 'https://www.google.com/s2/favicons?domain=supabase.com&sz=64', category_id: cats[5]?.id ?? null, is_favorite: false, created_at: now(), updated_at: now() },
        { id: generateId(), title: 'ChatGPT', description: 'AI assistant của OpenAI', url: 'https://chat.openai.com', icon_url: 'https://www.google.com/s2/favicons?domain=chat.openai.com&sz=64', category_id: cats[3]?.id ?? null, is_favorite: true, created_at: now(), updated_at: now() },
        { id: generateId(), title: 'Excalidraw', description: 'Vẽ diagram và whiteboard online', url: 'https://excalidraw.com', icon_url: 'https://www.google.com/s2/favicons?domain=excalidraw.com&sz=64', category_id: cats[4]?.id ?? null, is_favorite: false, created_at: now(), updated_at: now() },
    ];
    saveWebApps(apps);

    localStorage.setItem('syt_seeded', '1');
}

// --- Favicon fetcher ---
export async function fetchFaviconAndTitle(url: string): Promise<{ icon_url: string; title: string }> {
    try {
        const domain = new URL(url).hostname;
        const icon_url = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        return { icon_url, title: domain };
    } catch {
        return { icon_url: '', title: '' };
    }
}

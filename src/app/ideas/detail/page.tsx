'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import IdeaDetailClient from '@/components/IdeaDetailClient';

function IdeaDetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    if (!id) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: '#55556a' }}>
                Đang truyền ID...
            </div>
        );
    }

    return <IdeaDetailClient id={id} />;
}

export default function IdeaDetailPage() {
    return (
        <Suspense fallback={<div style={{ color: '#55556a', padding: '2rem' }}>Đang tải...</div>}>
            <IdeaDetailContent />
        </Suspense>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getGuestBooks } from '@/assets/api/guestBookApi';
import GuestbooksList from './components/GuestBookList';
import Button from '@/components/ui/Button';

const GuestbooksPage = () => {
    const router = useRouter();
    const [guestbooks, setGuestbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGuestbooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getGuestBooks();
            // 2025-12-18 : 내림차순 형태로 변경
            const sorted = [...data].sort((a, b) => 
                b.createdAt.localeCompare(a.createdAt)
            );
            setGuestbooks(sorted);
        } catch (err) {
            setError(err.message);
            console.error('방명록 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuestbooks();
    }, []);

    const handleUpdateSuccess = () => {
        fetchGuestbooks();
    };

    const handleDeleteSuccess = () => {
        fetchGuestbooks();
    };

    return (
        <div className="w-full max-w-[96rem] mx-auto my-0">
            <div className="bg-white rounded-[1.2rem] shadow-lg p-[4rem]">
                <div className="flex items-center justify-between mb-[4rem]">
                    <div>
                        <h2 className="text-[2.8rem] font-bold text-gray-800 mb-[1.2rem]">남겨진 말들</h2>
                        <p className="text-[1.6rem] text-gray-600">지나간 사람들의 기록</p>
                    </div>
                    <Button 
                        variant="bg" 
                        onClick={() => router.push('/guestbooks/new')}
                    >
                        기록 남기기
                    </Button>
                </div>
                
                {loading && (
                    <div className="text-center py-[6rem]">
                        <div className="inline-block animate-spin rounded-full h-[3.2rem] w-[3.2rem] border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 mt-[2rem] text-[1.4rem]">로딩 중...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-[2rem] py-[1.6rem] rounded-lg mb-[2rem]">
                        <p className="font-semibold text-[1.4rem] mb-[0.8rem]">오류 발생</p>
                        <p className="text-[1.2rem]">{error}</p>
                    </div>
                )}

                {!loading && !error && guestbooks.length === 0 && (
                    <div className="text-center py-[6rem]">
                        <div className="text-[6rem] mb-[2rem]">📝</div>
                        <p className="text-gray-500 text-[1.8rem] mb-[1.2rem]">작성된 방명록이 없습니다.</p>
                        <p className="text-gray-400 text-[1.4rem]">첫 번째 방명록을 작성해보세요!</p>
                    </div>
                )}

                {!loading && !error && guestbooks.length > 0 && (
                    <GuestbooksList 
                        guestbooks={guestbooks}
                        onUpdateSuccess={handleUpdateSuccess}
                        onDeleteSuccess={handleDeleteSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default GuestbooksPage;

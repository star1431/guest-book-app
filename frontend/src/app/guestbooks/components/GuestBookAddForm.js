'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addGuestBook } from '@/assets/api/guestBookApi';
import Button from '@/components/ui/Button';

const AddForm = ({ onAddSuccess }) => {
    const router = useRouter();
    
    // ref 객체로 관리
    const refs = useRef({
        nickName: null,
        password: null,
        content: null
    });
    
    const [formData, setFormData] = useState({
        nickName: '',
        password: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 필드 검증
        if (!formData.nickName.trim()) {
            setError('작성자명을 입력해주세요.');
            refs.current.nickName?.focus();
            return;
        }
        
        if (!formData.password.trim()) {
            setError('비밀번호를 입력해주세요.');
            refs.current.password?.focus();
            return;
        }
        
        if (!formData.content.trim()) {
            setError('내용을 입력해주세요.');
            refs.current.content?.focus();
            return;
        }

        // 길이 검증
        if (formData.nickName.trim().length > 50) {
            setError('작성자명은 50자 이하로 적어주세요.');
            refs.current.nickName?.focus();
            return;
        }
        
        if (formData.content.trim().length > 500) {
            setError('내용은 500자 이하로 적어주세요.');
            refs.current.content?.focus();
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            await addGuestBook(formData);
            
            // 폼 초기화
            setFormData({
                nickName: '',
                password: '',
                content: ''
            });
            
            // 성공 콜백 호출
            if (onAddSuccess) {
                onAddSuccess();
            } else {
                // 콜백이 없으면 홈으로 이동
                router.push('/');
            }
        } catch (err) {
            // API 에러 처리
            const errorMessage = err.message || '';
            if (errorMessage.includes('비밀번호') || errorMessage.includes('password') || errorMessage.includes('불일치')) {
                setError('비밀번호가 일치하지 않습니다.');
                refs.current.password?.focus();
            } else {
                setError('방명록 등록에 실패했습니다.');
            }
            console.error('방명록 등록 실패:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-[2.4rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.6rem]">
                <div>
                    <label htmlFor="nickName" className="block text-[1.4rem] font-semibold text-gray-700 mb-[0.8rem]">
                        작성자 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nickName"
                        id="nickName"
                        ref={el => refs.current.nickName = el}
                        value={formData.nickName}
                        onChange={handleChange}
                        placeholder="작성자명을 입력하세요"
                        className="w-full px-[1.6rem] py-[1.2rem] border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-all text-[1.4rem]"
                        maxLength={50}
                    />
                </div>
                
                <div>
                    <label htmlFor="password" className="block text-[1.4rem] font-semibold text-gray-700 mb-[0.8rem]">
                        비밀번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        ref={el => refs.current.password = el}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                        className="w-full px-[1.6rem] py-[1.2rem] border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-all text-[1.4rem]"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="content" className="block text-[1.4rem] font-semibold text-gray-700 mb-[0.8rem]">
                    내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="content"
                    id="content"
                    ref={el => refs.current.content = el}
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="방명록 내용을 입력하세요"
                    rows={8}
                    className="w-full px-[1.6rem] py-[1.2rem] border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-none transition-all text-[1.4rem]"
                    maxLength={500}
                />
                <div className="flex justify-between items-center mt-[0.8rem]">
                    <p className="text-[1.2rem] text-gray-500">
                        비밀번호는 수정/삭제 시 필요합니다
                    </p>
                    <p className="text-[1.2rem] text-gray-500">
                        {formData.content.length}/500
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-[1.6rem] py-[1.2rem] rounded-lg text-[1.4rem]">
                    {error}
                </div>
            )}

            <div className="flex justify-between gap-[1.2rem] pt-[1.6rem] border-t border-gray-200">
                <Button
                    variant="border"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push('/');
                    }}
                    disabled={isSubmitting}
                >
                    취소
                </Button>
                <Button
                    variant="bg"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    {isSubmitting ? '등록 중...' : '등록하기'}
                </Button>
            </div>
        </form>
    );
};

export default AddForm;

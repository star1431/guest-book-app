'use client';

import { useState, useRef } from 'react';
import { updateGuestBook, deleteGuestBook } from '@/assets/api/guestBookApi';
import Button from '@/components/ui/Button';

const GuestbooksListItem = ({ guestbook, onUpdateSuccess, onDeleteSuccess }) => {
    // 수정 on/off
    const [isEditing, setIsEditing] = useState(false);
    
    // 필드 ref
    const refs = useRef({
        nickName: null,
        password: null,
        content: null
    });

    // 수정 폼 데이터
    const [formData, setFormData] = useState({
        nickName: guestbook.nickName,
        password: '',
        content: guestbook.content
    });

    // 저장 클릭시 버튼 제어용 (문구, disabled)
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // 에러 메시지 관리
    const [error, setError] = useState(null);

    // 필드 변경시 데이터 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    // 수정 클릭시 데이터 업데이트
    const handleUpdate = async () => {
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
            await updateGuestBook(guestbook.id, formData);
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: '' }));
            
            if (onUpdateSuccess) {
                onUpdateSuccess();
            }
        } catch (err) {
            // API 에러 처리
            const errorMessage = err.message || '';
            if (errorMessage.includes('비밀번호') || errorMessage.includes('password') || errorMessage.includes('불일치')) {
                setError('비밀번호가 일치하지 않습니다.');
                refs.current.password?.focus();
            } else {
                setError('수정에 실패했습니다.');
            }
            console.error('방명록 수정 실패:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const password = prompt('삭제하려면 비밀번호를 입력해주세요.');
        if (!password) return;

        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await deleteGuestBook(guestbook.id, password);
            
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
        } catch (err) {
            const errorMessage = err.message || '';
            if (errorMessage.includes('비밀번호') || errorMessage.includes('password') || errorMessage.includes('불일치')) {
                alert('비밀번호가 일치하지 않습니다.');
            } else {
                alert('삭제에 실패했습니다.');
            }
            console.error('방명록 삭제 실패:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            nickName: guestbook.nickName,
            password: '',
            content: guestbook.content
        });
        setError(null);
    };

    return (
        <div className="border-2 border-gray-200 rounded-xl p-[2.4rem] mb-[2.4rem] last:mb-0 hover:shadow-lg transition-all duration-300 bg-white hover:border-blue-300">
            {isEditing ? (
                <div className="space-y-[2.4rem]">
                    <h3 className="text-[1.8rem] font-semibold text-gray-800 mb-[2rem] m-0">방명록 수정</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem]">
                        <div>
                            <label htmlFor={`edit-nickName-${guestbook.id}`} className="block text-[1.4rem] font-semibold text-gray-700 mb-[1.2rem] m-0">
                                작성자
                            </label>
                            <input
                                type="text"
                                name="nickName"
                                id={`edit-nickName-${guestbook.id}`}
                                ref={el => refs.current.nickName = el}
                                value={formData.nickName}
                                onChange={handleChange}
                                className="w-full px-[1.6rem] py-[1.2rem] border-1 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-all text-[1.4rem] m-0"
                                maxLength={50}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor={`edit-password-${guestbook.id}`} className="block text-[1.4rem] font-semibold text-gray-700 mb-[1.2rem] m-0">
                                비밀번호 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                id={`edit-password-${guestbook.id}`}
                                ref={el => refs.current.password = el}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력하세요"
                                className="w-full px-[1.6rem] py-[1.2rem] border-1 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-all text-[1.4rem] m-0"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor={`edit-content-${guestbook.id}`} className="block text-[1.4rem] font-semibold text-gray-700 mb-[1.2rem] m-0">
                            내용
                        </label>
                        <textarea
                            name="content"
                            id={`edit-content-${guestbook.id}`}
                            ref={el => refs.current.content = el}
                            value={formData.content}
                            onChange={handleChange}
                            rows={6}
                            className="w-full px-[1.6rem] py-[1.2rem] border-1 border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-none transition-all text-[1.4rem] m-0"
                            maxLength={500}
                        />
                        <p className="text-[1.2rem] text-gray-500 mt-[1.2rem] mb-0 text-right">
                            {formData.content.length}/500
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-[1.6rem] py-[1.2rem] rounded-lg text-[1.4rem] m-0">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-[1.2rem] pt-[2rem] border-t border-gray-200 m-0">
                        <Button
                            variant="border"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            취소
                        </Button>
                        <Button
                            variant="bg"
                            onClick={handleUpdate}
                            disabled={isSubmitting}
                            className={isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            {isSubmitting ? '수정 중...' : '저장'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-[2rem] m-0">
                    <div className="flex items-start justify-between m-0">
                        <div className="flex-1 m-0">
                            <div className="flex items-center gap-[1.6rem] mb-[2rem] m-0">
                                <div className="w-[4.8rem] h-[4.8rem] bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[2rem] flex-shrink-0 m-0">
                                    {guestbook.nickName.charAt(0).toUpperCase()}
                                </div>
                                <div className="m-0">
                                    <span className="font-bold text-[1.8rem] text-gray-800 block mb-[0.8rem] m-0">
                                        {guestbook.nickName}
                                    </span>
                                    <span className="text-[1.2rem] text-gray-500 m-0 block">
                                        {guestbook.createdAt}
                                    </span>
                                </div>
                            </div>
                            <div className="pl-[6.4rem] m-0">
                                <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed text-[1.6rem] m-0">
                                    {guestbook.content}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-[2rem] mt-[1.2rem] pt-[1.2rem] border-t border-gray-100 m-0">
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={isSubmitting}
                            className="px-[2rem] py-[1rem] text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 text-[1.4rem] m-0"
                        >
                            ✏️ 수정
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="px-[2rem] py-[1rem] text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 text-[1.4rem] m-0"
                        >
                            🗑️ 삭제
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestbooksListItem;

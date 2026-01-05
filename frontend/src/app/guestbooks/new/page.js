'use client';

import AddForm from '../components/GuestBookAddForm';

const NewGuestbookPage = () => {
    return (
        <div className="max-w-[80rem] mx-auto w-full">
            <div className="bg-white rounded-lg shadow-lg p-[3.2rem]">
                <div className="mb-[2.4rem]">
                    <h1 className="text-[2.8rem] font-bold text-gray-800 mb-[0.8rem]">이야기 작성</h1>
                    <p className="text-[1.6rem] text-gray-600">당신의 이야기를 남겨주세요.</p>
                </div>
                <AddForm />
            </div>
        </div>
    );
};

export default NewGuestbookPage;

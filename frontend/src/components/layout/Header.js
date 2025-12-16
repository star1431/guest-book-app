import Link from 'next/link';

const Header = () => {
    return (
        <header className="ui-header m-0">
            <div className="w-full max-w-[120rem] mx-auto m-0">
                <Link href="/" className="block hover:opacity-90 transition-opacity m-0">
                    <h1 className="text-[3.2rem] font-bold mb-[0.8rem] leading-tight m-0">소중한 이야기</h1>
                    <p className="text-[1.6rem] text-purple-100 m-0">당신의 마음 속 이야기를 전해주세요</p>
                </Link>
            </div>
        </header>
    );
};

export default Header;

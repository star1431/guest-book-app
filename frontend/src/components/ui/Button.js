'use client';

const Button = ({ variant = 'bg', onClick, children, className = '', disabled, ...props }) => {
    // 버튼 스타일 맵핑 객체
    const variantStyles = {
        bg: 'bg-blue-600 text-white px-[2rem] py-[1.2rem] rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-[1.4rem] disabled:opacity-50 disabled:cursor-not-allowed',
        underline: 'text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer underline-offset-2 disabled:opacity-50 text-[1.4rem]',
        border: 'border-2 border-blue-600 text-blue-600 px-[2rem] py-[1.2rem] rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-[1.4rem] disabled:opacity-50 disabled:cursor-not-allowed',
    };

    // variant에 맞는 스타일 가져오기 (기본값: bg)
    const baseStyle = variantStyles[variant] || variantStyles.bg;
    
    // 추가 className이 있으면 병합
    const combinedClassName = className 
        ? `${baseStyle} ${className}` 
        : baseStyle;

    return (
        <button 
            type="button"
            onClick={onClick} 
            className={combinedClassName}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

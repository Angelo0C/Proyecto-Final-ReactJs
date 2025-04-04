export default function ButtonComponent({ text, onClick, className = '' }) {
    return (
        <button className={`headerbutton ${className}`} onClick={onClick}>
            {text}
        </button>
    );
}


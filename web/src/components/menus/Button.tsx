import React from 'react';

interface ButtonProps {
  style: 'primary' | 'secondary'
  label: string,
  onClick: () => void,
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    style,
    label,
    onClick
  } = props;

  const styles: Record<typeof style, string> = {
    primary: 'bg-blue-500 border border-blue-600 rounded text-amber-50',
    secondary: 'mr-2 text-amber-50/70'
  };

  return (
    <button
      className={`px-2 ${styles[style]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;

import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  colors: string[];
  animationSpeed?: number;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors,
  animationSpeed = 3,
  className = '',
}) => {
  const gradientStyle = {
    background: `linear-gradient(to right, ${colors.join(',')})`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `gradient ${animationSpeed}s linear infinite`,
  };

  return (
    <span
      className={`inline-block ${className}`}
      style={gradientStyle}
    >
      {children}
    </span>
  );
};

export default GradientText;
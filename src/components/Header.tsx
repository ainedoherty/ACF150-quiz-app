import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
};

export default Header; 
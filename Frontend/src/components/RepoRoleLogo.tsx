import React from 'react';
import logoUrl from '../../public/assets/logo.svg';

interface RepoRoleLogoProps {
  className?: string;
  size?: number;
  alt?: string;
}

export const RepoRoleLogo: React.FC<RepoRoleLogoProps> = ({
  className = 'w-12 h-12 md:w-14 md:h-14',
  size,
  alt = 'RepoRole Logo',
}) => {
  return (
    <img
      src={logoUrl}
      alt={alt}
      width={size}
      height={size}
      className={`${className} object-contain select-none`}
      loading="eager"
      decoding="async"
    />
  );
};

export default RepoRoleLogo;



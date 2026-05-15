import { avatarUrl } from '../../utils/formatters.js';

export default function AvatarImg({ seed, size = 'md', className = '' }) {
  const sizes = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-14 h-14', xl: 'w-20 h-20' };
  return (
    <img
      src={avatarUrl(seed)}
      alt={seed}
      className={`${sizes[size]} rounded-full ring-2 ring-white shadow-sm object-cover ${className}`}
      loading="lazy"
    />
  );
}

import { loadAvatar, getAvatarGradientStyle, getEmojiById } from '../utils/avatarConfig';

/**
 * Reusable Avatar component.
 * Reads saved avatar config and renders initial, or emoji style.
 * Props: email, initial, size ('sm' | 'md' | 'lg'), onClick, className
 */
export default function Avatar({ email, initial = '?', size = 'md', onClick, className = '' }) {
  const avatar = loadAvatar(email);
  const gradientStyle = getAvatarGradientStyle(avatar.gradient);

  const sizeClass = size === 'sm' ? 'avatar-circle avatar-circle-sm'
    : size === 'lg' ? 'avatar-circle avatar-circle-lg'
    : 'avatar-circle';

  const baseClass = `${sizeClass} avatar-custom ${onClick ? 'avatar-btn' : ''} ${className}`.trim();

  const style = { background: gradientStyle };

  if (avatar.type === 'emoji') {
    const emoji = getEmojiById(avatar.emoji);
    return (
      <div className={baseClass} style={style} onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        aria-label="Profile avatar"
      >
        <span className="avatar-emoji">{emoji}</span>
      </div>
    );
  }

  // Default: initial
  return (
    <div className={baseClass} style={style} onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      aria-label="Profile avatar"
    >
      {initial}
    </div>
  );
}

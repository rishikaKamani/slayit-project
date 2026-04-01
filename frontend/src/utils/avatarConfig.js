// ── Avatar Configuration ──
// Defines all avatar options and helpers

export const AVATAR_GRADIENTS = [
  { id: 'brand',   label: 'Brand',   style: 'linear-gradient(135deg, #f08ac0 0%, #d784f7 100%)' },
  { id: 'ocean',   label: 'Ocean',   style: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)' },
  { id: 'fire',    label: 'Fire',    style: 'linear-gradient(135deg, #fb923c 0%, #ef4444 100%)' },
  { id: 'forest',  label: 'Forest',  style: 'linear-gradient(135deg, #4ade80 0%, #059669 100%)' },
  { id: 'gold',    label: 'Gold',    style: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
  { id: 'royal',   label: 'Royal',   style: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' },
  { id: 'rose',    label: 'Rose',    style: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)' },
  { id: 'slate',   label: 'Slate',   style: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)' },
];

export const EMOJI_AVATARS = [
  { id: 'crown',   emoji: '👑' },
  { id: 'fire',    emoji: '🔥' },
  { id: 'brain',   emoji: '🧠' },
  { id: 'demon',   emoji: '😈' },
  { id: 'star',    emoji: '⭐' },
  { id: 'target',  emoji: '🎯' },
  { id: 'muscle',  emoji: '💪' },
  { id: 'diamond', emoji: '💎' },
  { id: 'bolt',    emoji: '⚡' },
  { id: 'rocket',  emoji: '🚀' },
  { id: 'ghost',   emoji: '👻' },
  { id: 'alien',   emoji: '👾' },
];

export const AVATAR_TYPES = [
  { value: 'initial', label: 'Initial' },
  { value: 'emoji',   label: 'Emoji'   },
];

export const DEFAULT_AVATAR = {
  type: 'initial',       // 'initial' | 'emoji'
  gradient: 'brand',
  emoji: 'crown',
};

export function loadAvatar(email) {
  try {
    const raw = localStorage.getItem(`slayit_avatar_${email || 'guest'}`);
    return raw ? { ...DEFAULT_AVATAR, ...JSON.parse(raw) } : { ...DEFAULT_AVATAR };
  } catch {
    return { ...DEFAULT_AVATAR };
  }
}

export function saveAvatar(email, avatar) {
  localStorage.setItem(`slayit_avatar_${email || 'guest'}`, JSON.stringify(avatar));
}

export function getAvatarGradientStyle(gradientId) {
  return AVATAR_GRADIENTS.find((g) => g.id === gradientId)?.style
    || AVATAR_GRADIENTS[0].style;
}

export function getEmojiById(emojiId) {
  return EMOJI_AVATARS.find((e) => e.id === emojiId)?.emoji || '👑';
}

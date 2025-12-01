export const THEMES = [
  { value: 'CRUSH', label: '💕 Crush', description: 'That person you can\'t stop thinking about' },
  { value: 'FIRST_LOVE', label: '🌸 First Love', description: 'The one who started it all' },
  { value: 'UNSENT_APOLOGY', label: '🕊️ Unsent Apology', description: 'Words you wish you could say' },
  { value: 'LONG_DISTANCE', label: '🌍 Long Distance', description: 'Miles apart, hearts together' },
  { value: 'SECRET_ADMIRER', label: '🎭 Secret Admirer', description: 'Anonymous feelings from afar' },
  { value: 'MOVING_ON', label: '🦋 Moving On', description: 'Letting go, growing forward' },
  { value: 'WHAT_IF', label: '✨ What If', description: 'The roads not taken' },
  { value: 'GRATITUDE', label: '💖 Gratitude', description: 'Thank you for existing' },
] as const;

export const RATE_LIMIT = {
  MAX_STARS_PER_IP_PER_HOUR: 3,
  MAX_REACTIONS_PER_IP_PER_HOUR: 20,
};

export const MODERATION = {
  ENABLE_AI_MODERATION: false, // Toggle when ready to integrate AI
  MAX_MESSAGE_LENGTH: 500,
  MIN_MESSAGE_LENGTH: 10,
};

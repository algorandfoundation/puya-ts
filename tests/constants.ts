export const Environment = {
  IsCi: process.env.NODE_ENV === 'ci',
} as const

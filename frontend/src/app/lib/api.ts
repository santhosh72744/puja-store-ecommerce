export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';

export const apiUrl = (path: string) =>
  `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

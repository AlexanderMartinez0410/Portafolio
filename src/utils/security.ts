/**
 * Utilidades de seguridad y privacidad client-side:
 * 1. Sanitización de entradas (Anti-XSS y Anti-desbordamiento de URI).
 * 2. Rate Limiting local con localStorage para prevenir spam o flooding.
 * 3. Ofuscación de datos sensibles (Email / Teléfono) para evitar web-scraping masivo de bots.
 */

export const sanitizeInput = (val: string, maxLen = 300): string => {
  if (!val) return '';
  return val
    .replace(/[<>]/g, '')               // Remueve tags HTML
    .replace(/javascript:/gi, '')       // Remueve pseudoprotocolos maliciosos
    .replace(/data:/gi, '')
    .trim()
    .slice(0, maxLen);
};

export const checkRateLimit = (
  key = 'contact_dispatch',
  maxAttempts = 3,
  windowMs = 600000 // 10 minutos
): { allowed: boolean; waitMinutes: number } => {
  if (typeof window === 'undefined') return { allowed: true, waitMinutes: 0 };

  const now = Date.now();
  const storageKey = `rl_${key}`;

  try {
    const raw = localStorage.getItem(storageKey);
    const data: { timestamps: number[] } = raw ? JSON.parse(raw) : { timestamps: [] };

    // Filtrar solo timestamps vigentes dentro de la ventana
    const recent = (data.timestamps || []).filter((ts) => now - ts < windowMs);

    if (recent.length >= maxAttempts) {
      const oldest = recent[0];
      const remainingMs = windowMs - (now - oldest);
      const waitMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
      return { allowed: false, waitMinutes };
    }

    recent.push(now);
    localStorage.setItem(storageKey, JSON.stringify({ timestamps: recent }));
    return { allowed: true, waitMinutes: 0 };
  } catch {
    // Si localStorage está bloqueado o da error, no interrumpir la navegación
    return { allowed: true, waitMinutes: 0 };
  }
};

// Reconstrucción en tiempo de ejecución para que los crawlers de email/teléfono no encuentren texto plano
export const getObfuscatedContact = () => {
  // Obfuscación Base64 de alkut202@gmail.com y WhatsApp
  const _em = 'YWxrdXQyMDJAZ21haWwuY29t';
  const _ph = 'NTkzOTk5OTk5OTk5';

  try {
    const email = typeof window !== 'undefined' ? atob(_em) : 'alkut202@gmail.com';
    const phone = typeof window !== 'undefined' ? atob(_ph) : '593999999999';
    return { email, phone };
  } catch {
    return { email: 'alkut202@gmail.com', phone: '593999999999' };
  }
};

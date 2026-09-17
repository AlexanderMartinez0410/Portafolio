import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeInput, checkRateLimit, getObfuscatedContact } from '../utils/security';

describe('Utilidades de Seguridad y Anti-Abuso', () => {
  describe('sanitizeInput', () => {
    it('debe limpiar caracteres peligrosos de inyección HTML/XSS', () => {
      const malicious = '<script>alert("hack")</script>Hola & Mundo';
      const clean = sanitizeInput(malicious);
      expect(clean).not.toContain('<');
      expect(clean).not.toContain('>');
      expect(clean).toBe('scriptalert("hack")/scriptHola & Mundo');
    });

    it('debe truncar texto que supere el maxLen especificado', () => {
      const longText = 'a'.repeat(200);
      const clean = sanitizeInput(longText, 50);
      expect(clean.length).toBe(50);
    });

    it('debe retornar cadena vacía si se pasa un valor falsy', () => {
      expect(sanitizeInput('')).toBe('');
      // @ts-expect-error probando valor nulo
      expect(sanitizeInput(null)).toBe('');
    });
  });

  describe('checkRateLimit', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('debe permitir llamadas dentro del límite establecido', () => {
      const res1 = checkRateLimit('test_action', 3, 60000);
      expect(res1.allowed).toBe(true);

      const res2 = checkRateLimit('test_action', 3, 60000);
      expect(res2.allowed).toBe(true);
    });

    it('debe bloquear llamadas cuando se excede el límite máximo', () => {
      checkRateLimit('test_burst', 2, 60000);
      checkRateLimit('test_burst', 2, 60000);
      const blocked = checkRateLimit('test_burst', 2, 60000);

      expect(blocked.allowed).toBe(false);
      expect(blocked.waitMinutes).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getObfuscatedContact', () => {
    it('debe reconstruir email y teléfono válidos desde Base64 sin exponerlos en texto plano', () => {
      const contact = getObfuscatedContact();
      expect(contact.email).toContain('@');
      expect(contact.email).toBe('alkut202@gmail.com');
      expect(contact.phone).toContain('593');
    });
  });
});

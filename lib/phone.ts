export const normalizePhone = (value: string): string =>
  value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[\s.\-()]/g, "")
    .replace(/^(\+212|00212)/, "0");

export const normalizeName = (value: string): string =>
  value
    .replace(/[\p{Cc}\p{Cf}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

export const isValidName = (value: string): boolean => {
  const normalized = normalizeName(value);
  return normalized.length >= 2 && normalized.length <= 80 && /\p{L}/u.test(normalized);
};

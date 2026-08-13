export function isNonEmptyString(value) {
  return String(value || "").trim().length > 0;
}

export function isValidEmail(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

export function isValidDateInput(value) {
  const text = String(value || "").trim();
  if (!text) return false;

  const parsed = new Date(`${text}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.toISOString().slice(0, 10) === text;
}

export function isDateOnOrAfter(value, referenceValue) {
  if (!isValidDateInput(value) || !isValidDateInput(referenceValue)) {
    return false;
  }

  return (
    new Date(`${value}T00:00:00`) >= new Date(`${referenceValue}T00:00:00`)
  );
}

export function isDateOnOrAfterToday(value) {
  const today = new Date();
  const referenceValue = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return isDateOnOrAfter(value, referenceValue);
}

export function isValidTimeInput(value) {
  const text = String(value || "").trim();
  if (!text) return false;

  return /^([01]\d|2[0-3]):[0-5]\d$/.test(text);
}

export function combineDateAndTime(dateValue, timeValue) {
  if (!isValidDateInput(dateValue) || !isValidTimeInput(timeValue)) {
    return null;
  }

  const combined = new Date(`${dateValue}T${timeValue}:00`);
  return Number.isNaN(combined.getTime()) ? null : combined;
}

export function isPositiveIntegerString(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  if (!/^\d+$/.test(text)) return false;
  return Number(text) > 0;
}

export function isNonNegativeNumberString(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  const numeric = Number(text);
  return Number.isFinite(numeric) && numeric >= 0;
}

export function isValidUrl(value) {
  const text = String(value || "").trim();
  if (!text) return true;

  try {
    // Accept standard absolute URLs only; empty values are handled by callers.
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

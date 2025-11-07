export function calculateCharges(charges: number, cooldownUntil: Date | null) {
  const MAX_CHARGES = 30;
  const RECHARGE_TIME_MS = 30_000;
  const now = Date.now();

  // if already full
  if (charges >= MAX_CHARGES) {
    return { charges: MAX_CHARGES, cooldownUntil: null };
  }

  // if no cooldown, full as well
  if (!cooldownUntil) {
    return { charges: MAX_CHARGES, cooldownUntil: null };
  }

  const cooldownEnd = new Date(cooldownUntil).getTime();

  // if still in cooldown period → not done yet
  if (cooldownEnd > now) {
    const remainingMs = cooldownEnd - now;
    const totalMissing = Math.ceil(remainingMs / RECHARGE_TIME_MS);
    const newCharges = MAX_CHARGES - totalMissing;
    return {
      charges: Math.max(newCharges, 0),
      cooldownUntil,
    };
  }

  // cooldown passed that means its fully recharged
  return { charges: MAX_CHARGES, cooldownUntil: null };
}

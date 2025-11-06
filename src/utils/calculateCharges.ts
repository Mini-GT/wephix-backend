export function calculateCharges(charges: number, cooldownUntil: Date | null) {
  const MAX_CHARGES = 30;
  const RECHARGE_TIME_MS = 30_000;
  const now = new Date();

  if (charges >= MAX_CHARGES) {
    return { charges: MAX_CHARGES, cooldownUntil: null };
  }

  if (!cooldownUntil) {
    return { charges: MAX_CHARGES, cooldownUntil: null };
  }

  const regenStartTime = new Date(cooldownUntil);
  const elapsed = now.getTime() - regenStartTime.getTime();

  if (elapsed < 0) {
    // cooldown is in the future
    return { charges, cooldownUntil };
  }

  const chargesRegained = Math.floor(elapsed / RECHARGE_TIME_MS);

  if (chargesRegained === 0) {
    return { charges, cooldownUntil };
  }

  const newCharges = Math.min(charges + chargesRegained, MAX_CHARGES);

  if (newCharges >= MAX_CHARGES) {
    return { charges: MAX_CHARGES, cooldownUntil: null };
  }

  // the cooldown should stay at the original regen start time
  // we just update the charges count
  return { charges: newCharges, cooldownUntil };
}

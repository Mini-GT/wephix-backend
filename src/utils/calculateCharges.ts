import { CalculateChargesType } from '@repo/types';

export default function calculateCharges({
  charges,
  cooldownUntil,
}: CalculateChargesType) {
  const MAX_CHARGES = 30;
  const RECHARGE_TIME = 30 * 1000; // 30 seconds per charge
  const now = Date.now();

  let cooldownUntilTime = cooldownUntil ? cooldownUntil.getTime() : null;

  // If user has max charges, there’s no cooldown to handle
  if (charges >= MAX_CHARGES) {
    return {
      charges: MAX_CHARGES,
      cooldownUntil: null,
    };
  }

  // If cooldownUntil exists and time has passed, calculate regenerated charges
  if (cooldownUntilTime && now >= cooldownUntilTime) {
    const diff = now - cooldownUntilTime;
    const regenerated = Math.floor(diff / RECHARGE_TIME) + 1; // +1 for the charge that regens exactly at cooldownUntil

    charges = Math.min(charges + regenerated, MAX_CHARGES);

    if (charges < MAX_CHARGES) {
      // Not full yet → set the next cooldown target
      const nextCooldown = cooldownUntilTime + regenerated * RECHARGE_TIME;
      cooldownUntilTime = nextCooldown;
    } else {
      // Fully charged → clear cooldown
      cooldownUntilTime = null;
    }
  }

  return {
    charges,
    cooldownUntil: cooldownUntilTime ? new Date(cooldownUntilTime) : null,
  };
}

import { CalculateChargesType } from '@repo/types';

export default function calculateCharges({
  charges,
  cooldownUntil,
}: CalculateChargesType) {
  const MAX_CHARGES = 30;
  const RECHARGE_TIME = 30 * 1000; // 30 seconds per charge
  const now = Date.now();

  let cooldownUntilTime = cooldownUntil ? cooldownUntil.getTime() : null;

  // If user has max charges, there’s no cooldown to handle so nothing to do
  if (charges >= MAX_CHARGES) {
    return {
      charges: MAX_CHARGES,
      cooldownUntil: null,
    };
  }

  if (!cooldownUntil) {
    // Not full but no cooldown? → start one now
    return { charges, cooldownUntil: new Date(now + RECHARGE_TIME) };
  }

  const cooldownTime = cooldownUntil.getTime();

  if (now < cooldownTime) {
    // Not enough time has passed for a new charge
    return { charges, cooldownUntil };
  }

  // At least one charge has regenerated
  const diff = now - cooldownTime;
  const regenerated = Math.floor(diff / RECHARGE_TIME) + 1;
  let newCharges = charges + regenerated;

  if (newCharges >= MAX_CHARGES) {
    return { charges: MAX_CHARGES, cooldownUntil: null };
  }

  const newCooldown = cooldownTime + regenerated * RECHARGE_TIME;
  return { charges: newCharges, cooldownUntil: new Date(newCooldown) };

  // // If cooldownUntil exists and time has passed, calculate regenerated charges
  // if (cooldownUntilTime && now >= cooldownUntilTime) {
  //   const diff = now - cooldownUntilTime;
  //   const regenerated = Math.floor(diff / RECHARGE_TIME) + 1; // +1 for the charge that regens exactly at cooldownUntil

  //   charges = Math.min(charges + regenerated, MAX_CHARGES);

  //   if (charges < MAX_CHARGES) {
  //     // Not full yet → set the next cooldown target
  //     const nextCooldown = cooldownUntilTime + regenerated * RECHARGE_TIME;
  //     cooldownUntilTime = nextCooldown;
  //   } else {
  //     // Fully charged → clear cooldown
  //     cooldownUntilTime = null;
  //   }
  // }

  // return {
  //   charges,
  //   cooldownUntil: cooldownUntilTime ? new Date(cooldownUntilTime) : null,
  // };
}

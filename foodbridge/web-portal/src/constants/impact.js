/**
 * Environmental Impact Conversion Constants
 * 
 * Sources & Assumptions:
 * 1. CO2e Emissions Factor: ~2.5 kg CO2e per 1.0 kg of food waste diverted from landfill (FAO-derived).
 * 2. Average Meal Weight: Assumes ~0.4 kg (400 grams) edible portion per meal.
 * 
 * Note: Actual impact varies by food composition, preparation, and local waste processing.
 */

export const KG_PER_MEAL = 0.40;
export const CO2E_PER_KG_WASTE = 2.50;

export const IMPACT_FOOTNOTE = "Estimates assume ~0.4 kg per meal and ~2.5 kg CO2e per kg of food waste (FAO-derived). Actual impact varies.";

/**
 * Calculates kilograms of food waste avoided given meal portions.
 * @param {number} meals - Number of meals
 * @returns {number} kg of food waste (rounded to 1 decimal place)
 */
export function calculateWasteKg(meals) {
  const count = Number(meals) || 0;
  return Math.round(count * KG_PER_MEAL * 10) / 10;
}

/**
 * Calculates kilograms of CO2e greenhouse gas emissions prevented.
 * @param {number} meals - Number of meals
 * @returns {number} kg of CO2e (rounded to 1 decimal place)
 */
export function calculateCo2eKg(meals) {
  const waste = calculateWasteKg(meals);
  return Math.round(waste * CO2E_PER_KG_WASTE * 10) / 10;
}

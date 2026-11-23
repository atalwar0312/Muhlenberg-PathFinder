/**
 * Returns whether a catalog course satisfies one requirement item.
 * Exact requirements use `number`; selectable numeric ranges use min_number/max_number.
 */
export function courseMatchesRequirementItem(course, item) {
  const coursePrefix = normalize(course?.prefix);
  const itemPrefix = normalize(item?.prefix);
  if (!coursePrefix || !itemPrefix || coursePrefix !== itemPrefix) return false;

  if (item.number !== null && item.number !== undefined && String(item.number).trim() !== "") {
    return String(course.number).trim().toLowerCase() === String(item.number).trim().toLowerCase();
  }

  const courseNumber = Number.parseInt(String(course.number), 10);
  const min = item.min_number == null ? null : Number(item.min_number);
  const max = item.max_number == null ? null : Number(item.max_number);
  if (!Number.isFinite(courseNumber)) return false;
  if (min !== null && (!Number.isFinite(min) || courseNumber < min)) return false;
  if (max !== null && (!Number.isFinite(max) || courseNumber > max)) return false;
  return min !== null || max !== null;
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

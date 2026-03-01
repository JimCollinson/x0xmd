export function validateRefreshLockData(lock, refs) {
  if (!lock || typeof lock !== "object") {
    throw new Error("Upstream refresh lock must be a JSON object.");
  }

  if (!lock.refs || typeof lock.refs !== "object") {
    throw new Error("Upstream refresh lock is missing required 'refs' object.");
  }

  const missingBaselines = refs
    .map((ref) => ref.id)
    .filter((id) => typeof lock.refs[id] !== "string" || lock.refs[id].trim().length === 0);

  if (missingBaselines.length > 0) {
    throw new Error(
      `Upstream refresh lock is missing baseline refs: ${missingBaselines.join(", ")}. ` +
        "Refusing to continue in fail-closed mode."
    );
  }

  return lock;
}

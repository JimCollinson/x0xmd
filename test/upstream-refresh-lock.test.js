import test from "node:test";
import assert from "node:assert/strict";

import { validateRefreshLockData } from "../scripts/ops/refresh-upstream-lock.mjs";

test("accepts lock data when every upstream ref has a baseline", () => {
  const refs = [{ id: "repo-main" }, { id: "install-sh" }];
  const lock = {
    refs: {
      "repo-main": "abc123",
      "install-sh": "def456"
    }
  };

  const validated = validateRefreshLockData(lock, refs);
  assert.equal(validated, lock);
});

test("fails closed when refs object is missing", () => {
  assert.throws(
    () => validateRefreshLockData({}, [{ id: "repo-main" }]),
    /missing required 'refs' object/
  );
});

test("fails closed when one or more baseline refs are missing", () => {
  assert.throws(
    () =>
      validateRefreshLockData(
        {
          refs: {
            "repo-main": "abc123"
          }
        },
        [{ id: "repo-main" }, { id: "install-sh" }]
      ),
    /missing baseline refs: install-sh/
  );
});

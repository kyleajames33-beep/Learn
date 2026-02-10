# Bug Log

**Purpose:** Track all known issues, fixes applied, and open bugs.
**Last Updated:** 2026-02-09

---

## Severity Levels

| Level | Meaning | Response |
|-------|---------|----------|
| CRITICAL | App broken, lessons won't load | Fix immediately, before any other work |
| MAJOR | Feature broken but app usable | Fix before next deployment |
| MINOR | Cosmetic or non-blocking issue | Fix when convenient |
| INFO | Not a bug, just a note | No action needed |

---

## Open Bugs

| # | Severity | Description | Found | Affected | Notes |
|---|----------|-------------|-------|----------|-------|
| 5 | MINOR | Lesson renders twice on load (duplicate console logs) | 2026-02-09 | All lessons | Old auto-init in lesson-renderer.js was removed but browser may cache old version |
| 6 | INFO | "Tracking Prevention blocked storage" warning in Edge | 2026-02-09 | Edge browser | Browser privacy feature, not a code bug. StorageManager handles gracefully. |

---

## Fixed Bugs

| # | Severity | Description | Found | Fixed | Root Cause | Fix Applied |
|---|----------|-------------|-------|-------|------------|-------------|
| 1 | CRITICAL | Service worker 404 — wrong path registered | 2026-02-09 | 2026-02-09 | `document.currentScript` is null inside async `load` event callback. SW path resolved against page URL instead of script URL. | Capture `document.currentScript.src` synchronously at module level before any async callbacks. |
| 2 | MAJOR | Stale service worker can't be unregistered from DevTools | 2026-02-09 | 2026-02-09 | Browser kept the failed SW registration; DevTools unregister button unresponsive. | Added auto-unregister of all existing SWs before re-registering. |
| 3 | MAJOR | Lesson content invisible below hero | 2026-02-09 | 2026-02-09 | CSS `.reveal { opacity: 0 }` hid all content sections. IntersectionObserver used class `.revealed` but CSS expected `.visible`. Browser cached old CSS. | Changed `.reveal` default to `opacity: 1`, fixed observer to use `.visible`, bumped all cache-busting versions. |
| 4 | MAJOR | Lesson 6+ fails schema validation | 2026-02-09 | 2026-02-09 | ID pattern `^module-[0-9]+-[a-z-]+-lesson-[0-9]+$` rejected new format `mod1-lesson06`. | Updated regex to accept both formats: `^(module-...|mod[0-9]+-lesson[0-9]+)$` |
| 7 | MINOR | Navigation chain error in module-1-cells-lesson-2 | 2026-02-10 | 2026-02-10 | Navigation.previous pointed to "module-1-cells-lesson-1" which didn't exist in same directory. | Changed previous to null (lesson-1 exists in different format/location) |
| 8 | MINOR | Navigation chain error in module-5-heredity-lesson-1 | 2026-02-10 | 2026-02-10 | Navigation.next pointed to "module-5-heredity-lesson-2" which doesn't exist. | Changed next to null (lesson-2 not yet created) |
| 9 | INFO | Duplicate lesson files across directories | 2026-02-10 | 2026-02-10 | Lesson files existed in both data/lessons/ and hsc-biology/data/lessons/ causing confusion. | Established data/lessons/ as single source of truth, removed duplicates from hsc-biology/ |

---

## Bug Reporting Template

When logging a new bug:

```markdown
| # | Severity | Description | Found | Affected | Notes |
|---|----------|-------------|-------|----------|-------|
| N | CRITICAL/MAJOR/MINOR/INFO | What's happening | YYYY-MM-DD | Which lessons/pages | Any context |
```

When fixing a bug, move it to the Fixed Bugs table and add Root Cause + Fix Applied columns.

---

**Location:** `/docs/trackers/BUG-LOG.md`
**Update Frequency:** As bugs are found or fixed

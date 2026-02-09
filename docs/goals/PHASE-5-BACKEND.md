# Phase 5: Backend & Sync

**Status:** PLANNED
**Goal:** Add server-side infrastructure — user accounts, cross-device sync, data persistence beyond localStorage.

**Entry Criteria:** Phase 4 complete.

---

## Exit Criteria

- [ ] User authentication working (email/password + Google OAuth)
- [ ] Progress syncs across devices (phone to laptop)
- [ ] All localStorage data migrated to server
- [ ] Teacher dashboard for classroom management
- [ ] Data backup and recovery
- [ ] GDPR/privacy compliance for student data

---

## Planned Milestones

### M5.1: Firebase Integration
- [ ] Firebase project setup
- [ ] Authentication (email/password + Google)
- [ ] Firestore database schema
- [ ] Data migration from localStorage
- [ ] Offline-first with sync (Firebase offline persistence)

### M5.2: User Accounts
- [ ] Sign up / login flow
- [ ] Profile page
- [ ] Progress data stored server-side
- [ ] Anonymous → authenticated account upgrade (preserve progress)

### M5.3: Cross-Device Sync
- [ ] Progress syncs in real-time
- [ ] Conflict resolution (last-write-wins or merge)
- [ ] Works offline, syncs when back online

### M5.4: Teacher Dashboard
- [ ] Teacher account type
- [ ] Create class, add students
- [ ] View student progress per lesson
- [ ] Export class data (CSV/PDF)

### M5.5: Data & Privacy
- [ ] Privacy policy
- [ ] Data deletion capability
- [ ] Under-18 protections
- [ ] Parental consent flow (if required)

---

## Technical Decisions (Deferred)
- Firebase vs Supabase vs custom backend
- Real-time sync vs polling
- Student data encryption requirements
- Hosting: stay on GitHub Pages + Firebase, or migrate to Vercel/Netlify

---

**Location:** `/docs/goals/PHASE-5-BACKEND.md`
**Update Frequency:** When Phase 5 approaches

# 📘 AgeWell Test Documentation Manual  
**Version**: 1.0  
**Date**: March 27, 2025  

---

## ✅ User Story-Based Test Plan

---

### 🧑‍⚕️ **User Story 1: As a User, I want to Register/Login**

**Acceptance Criteria:**  
- Users can register with role selection.  
- Users can log in and get a token.  
- Redirects to correct dashboard based on role.

#### ✅ Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-001 | User opens Register page | Register form is visible |
| TC-002 | User selects role (elderly, caregiver, etc.) | Role saved in DB |
| TC-003 | Submit valid registration form | Success message shown |
| TC-004 | Try duplicate email | Error message shown |
| TC-005 | Login with valid credentials | Redirected and token stored |
| TC-006 | Login with wrong credentials | Error: "Invalid credentials" |
| TC-007 | JWT is included in future requests | Backend accepts token |

---

### 👴 **User Story 2: As an Elderly User, I want to Manage Emergency Contacts**

**Acceptance Criteria:**  
- Elderly can add/delete emergency contacts.  
- No other roles can modify them.

#### ✅ Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-008 | Elderly adds contact | Contact appears in UI & DB |
| TC-009 | Elderly deletes contact | Contact removed |
| TC-010 | Caregiver or Family tries to add | Access Denied (403) |

---

### 🕓 **User Story 3: As a Caregiver, I want to Manage Schedules**

**Acceptance Criteria:**  
- Caregiver can create/update/delete schedule for elderly.  
- Elderly & Family can view schedules.

#### ✅ Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-011 | Caregiver creates a schedule | Schedule saved and listed |
| TC-012 | Caregiver updates schedule | Changes reflected |
| TC-013 | Caregiver deletes schedule | Removed from UI and DB |
| TC-014 | Elderly views schedule | Sees read-only view |
| TC-015 | Family views schedule | Sees assigned elderly’s schedule |

---

### 🍽 **User Story 4: As a Caregiver, I want to Manage Elderly’s Diet Plan**

**Acceptance Criteria:**  
- Editable by caregiver.  
- Read-only for elderly and healthcare.

#### ✅ Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-016 | Caregiver adds diet plan | Appears in elderly UI |
| TC-017 | Caregiver edits meal detail | Updates shown |
| TC-018 | Elderly or Healthcare views plan | Read-only access |
| TC-019 | Unauthorized user modifies | Access Denied |

---

### 💊 **User Story 5: As an Elderly, I want to Mark Medication as Taken**

**Acceptance Criteria:**  
- Checkbox shown per medication.  
- Marking updates status.

#### ✅ Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-020 | Elderly views prescription list | Rendered from backend |
| TC-021 | Elderly marks as taken | Status updates and saves to DB |
| TC-022 | Already taken → checkbox disabled | Cannot re-check |
| TC-023 | Other roles try to update | 403 Forbidden |

---

### 🔔 **User Story 6: As a Caregiver, I want to be Notified When Elderly Misses Medication**

**Acceptance Criteria:**  
- If not taken after a time threshold, notify caregiver.  
- Shown in bell icon, optional sound.

#### ✅ Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-024 | Elderly misses dose after threshold | Notification created |
| TC-025 | Caregiver sees bell icon increment | Badge count updates |
| TC-026 | Caregiver opens bell dropdown | Sees message |
| TC-027 | Mark all as read | Badge resets |
| TC-028 | Sound plays on new alerts | `notification.mp3` plays once |

---

### 🛠 **Admin Management (Limited)**

**Clarified Scope:**  
- Admin does **not approve** users.
- Admin assists with edge-case login issues or re-assignments.

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-029 | Admin logs in | Admin dashboard loads |
| TC-030 | Admin reassigns user manually | DB updates |
| TC-031 | Admin accesses protected routes | Allowed by RBAC |
| TC-032 | Admin views user list (future scope) | To be implemented |

---

### 🎨 **User Interface Tests**

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-033 | Login/Register page shows logo background | Background visible and styled |
| TC-034 | Blurring only applies to background, not form | Form clear, background blurred |
| TC-035 | Mobile responsiveness | Layout adjusts properly |
| TC-036 | Notifications visible in header | Bell icon is visible |

---

## 🔐 Security Notes
- JWT tokens secured in localStorage.
- Backend routes protected via `verifyToken` middleware.
- Only permitted roles can access respective APIs.

---

## 🧹 Cleanup Steps (Post-Test)
- Clear dummy users from database
- Reset taken status for medication if required
- Clear test schedules or diets if no longer needed

---


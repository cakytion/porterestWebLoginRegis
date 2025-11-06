# E2E Test Plan

## Scenario ID: E2E-001

**Title:** User login and dashboard access (Google OAuth)

**Precondition:** Google OAuth configured

**Steps:**
1)	Open home page (/Login)
2)	Click Sign in with Google
3)	After callback navigate to /Dashboard
4)	Verify username/email visible

**Expected:** Dashboard shows authenticated user info

## Scenario ID: E2E-002

**Title:** User registration

**Precondition:** No account tied to the email used for registration.

**Steps:**
1)	Open home page
2)	Click Sign Up
3)	Enter appropriate email and password
4)	Click Register button
5)	After successful account registration navigate to /FinishSignup
6)	Redirect to /Dashboard
7)	Verify username/email visible

**Expected:** Account is created. Information is stored in the database. Dashboard shows authenticated user info

## Scenario ID: E2E-003

**Title:** User login

**Precondition:** Account must already be registered.

**Steps:**
1)	Open home page
2)	Enter appropriate email and password
3)	Click Login button
4)	After successful login navigate to /Dashboard
5)	Verify username/email visible

**Expected:** Dashboard shows authenticated user info

## Scenario ID: E2E-004

**Title:** Unauthenticated page access

**Precondition:** User isn’t logged in and tries to access a page directly via URL

**Steps:** 
1)	Open a link to /Dashboard directly via clicking a link or entering it into the search engine
2)	The system detected unauthorized access to the page
3)	Redirect to home page

**Expected:** Unauthorized access get redirect to home page

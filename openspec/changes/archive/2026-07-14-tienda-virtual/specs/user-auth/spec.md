# User Authentication Specification

## Purpose

The user authentication capability provides secure user registration, login, and session management using NextAuth.js v5. It supports email/password credentials and optional Google OAuth, enables order history viewing, and integrates with the checkout flow for customer identification.

## Requirements

### Requirement: User Registration

The system SHALL allow new users to register with email and password. Registration SHALL validate email format, enforce password strength, and create a user record in Sanity.

#### Scenario: Successful registration

- GIVEN a visitor is on the /auth/register page
- WHEN they enter a valid email, password, and confirm password
- AND the password meets strength requirements (min 8 chars, 1 uppercase, 1 number)
- THEN a new user account is created in Sanity
- AND the user is automatically logged in
- AND redirected to the homepage or previous page

#### Scenario: Duplicate email registration

- GIVEN a user with "test@example.com" already exists
- WHEN a new visitor attempts to register with "test@example.com"
- THEN an error message "An account with this email already exists" is displayed
- AND the form remains filled (except password fields)
- AND no duplicate account is created

#### Scenario: Password mismatch

- GIVEN a visitor enters different values in password and confirm password fields
- WHEN they submit the registration form
- THEN an error message "Passwords do not match" is displayed
- AND the form is not submitted

#### Scenario: Invalid email format

- GIVEN a visitor enters "not-an-email" in the email field
- WHEN they submit the registration form
- THEN an email validation error is displayed
- AND the form is not submitted

#### Scenario: Weak password

- GIVEN a visitor enters "123" as their password
- WHEN they submit the registration form
- THEN a password strength error is displayed
- AND requirements (min 8 chars, 1 uppercase, 1 number) are shown

### Requirement: User Login

The system SHALL allow registered users to login with email and password. Login SHALL validate credentials against Sanity-stored user records and establish a session.

#### Scenario: Successful login

- GIVEN a registered user is on the /auth/login page
- WHEN they enter correct email and password
- THEN a session is established
- AND they are redirected to the homepage or previous page
- AND the header shows their account name/email

#### Scenario: Invalid credentials

- GIVEN a user enters incorrect email or password
- WHEN they submit the login form
- THEN an error message "Invalid email or password" is displayed
- AND no session is created
- AND the form remains filled (except password)

#### Scenario: Account lockout after failed attempts

- GIVEN a user enters wrong credentials 5 times consecutively
- WHEN they attempt a 6th login
- THEN the account is temporarily locked for 15 minutes
- AND a message "Account temporarily locked. Try again later." is displayed

#### Scenario: Login with remember me

- GIVEN a user checks "Remember me" on login
- WHEN they successfully log in
- THEN the session persists for 30 days
- AND they remain logged in after browser close

### Requirement: OAuth Login (Google)

The system SHALL support Google OAuth as an alternative login method. Users authenticating via Google SHALL be automatically registered if no existing account matches their email.

#### Scenario: Google OAuth login - new user

- GIVEN a visitor clicks "Sign in with Google"
- WHEN they complete the Google OAuth flow
- AND no existing account matches their Google email
- THEN a new account is created with their Google email
- AND they are logged in and redirected to the homepage

#### Scenario: Google OAuth login - existing user

- GIVEN a user with "user@gmail.com" registered via email/password
- When they click "Sign in with Google" with the same email
- THEN they are logged in with their existing account
- AND their Google profile picture is optionally synced

#### Scenario: Google OAuth cancellation

- GIVEN a visitor initiates Google OAuth
- WHEN they cancel the OAuth flow
- THEN they are returned to the login page
- AND no session is created

### Requirement: Session Management

The system SHALL manage user sessions using NextAuth.js v5 with JWT strategy. Sessions SHALL include user ID, email, and name. Session tokens SHALL be secure and httpOnly.

#### Scenario: Session persistence

- GIVEN a user is logged in
- WHEN they navigate between pages
- THEN their session remains active
- AND authenticated content is accessible

#### Scenario: Session expiration

- GIVEN a user's session has expired (after 30 days or configured TTL)
- WHEN they attempt to access an authenticated page
- THEN they are redirected to /auth/login
- AND a message "Session expired. Please log in again." is displayed

#### Scenario: Logout

- GIVEN a user is logged in
- WHEN they click "Logout" in the header dropdown
- THEN the session is destroyed
- AND they are redirected to the homepage
- AND the header reverts to login/register links

#### Scenario: Concurrent sessions

- GIVEN a user is logged in on two devices
- WHEN they log out on one device
- THEN the session on the other device remains active
- AND both devices show appropriate auth state

### Requirement: Protected Routes

The system SHALL protect specific routes requiring authentication. Unauthenticated users accessing protected routes SHALL be redirected to login with a return URL.

#### Scenario: Access protected route when unauthenticated

- GIVEN a user is not logged in
- WHEN they navigate to /account or /checkout
- THEN they are redirected to /auth/login
- AND the return URL is preserved (e.g., /auth/login?returnTo=/account)

#### Scenario: Access protected route when authenticated

- GIVEN a user is logged in
- WHEN they navigate to /account
- THEN the account page is displayed
- AND their profile information is shown

#### Scenario: Post-login redirect

- GIVEN a user was redirected to login from /checkout
- WHEN they successfully log in
- THEN they are redirected back to /checkout
- AND their cart state is preserved

### Requirement: User Profile Display

The system SHALL display user profile information on /account page including email, name, and account creation date. Users SHALL be able to view their order history.

#### Scenario: Account page display

- GIVEN a logged-in user visits /account
- WHEN the page loads
- THEN their email, name, and account creation date are displayed
- AND a link to order history is visible
- AND a logout button is available

#### Scenario: Order history display

- GIVEN a logged-in user with past orders visits /account/orders
- WHEN the page loads
- THEN a list of their orders is displayed
- AND each order shows date, status, total, and item count
- AND orders are sorted by date (newest first)

#### Scenario: Empty order history

- GIVEN a logged-in user with no past orders visits /account/orders
- WHEN the page loads
- THEN a message "No orders yet" is displayed
- AND a link to browse products is shown

### Requirement: Error Handling

The system SHALL handle authentication errors gracefully with user-friendly messages. Technical errors SHALL be logged without exposing details to users.

#### Scenario: Network error during login

- GIVEN the authentication service is unreachable
- WHEN a user attempts to log in
- THEN a generic error message is displayed
- AND no technical details are exposed
- AND the form remains functional for retry

#### Scenario: Invalid session token

- GIVEN a user has a corrupted or invalid session token
- WHEN they access an authenticated page
- THEN the invalid session is cleared
- AND they are redirected to login

## Data Models

### Sanity Schema: User

```typescript
{
  name: 'user',
  type: 'document',
  fields: [
    { name: 'email', type: 'string', validation: required, unique: true },
    { name: 'name', type: 'string' },
    { name: 'passwordHash', type: 'string' }, // Only for credentials provider
    { name: 'image', type: 'string' }, // Google profile picture
    { name: 'emailVerified', type: 'datetime' },
    { name: 'createdAt', type: 'datetime' }
  ]
}
```

### NextAuth.js Configuration

```typescript
{
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      authorize: async (credentials) => {
        // Validate against Sanity user record
        // Return user object or null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: async ({ token, user }) => { /* Add user ID to token */ },
    session: async ({ session, token }) => { /* Add user ID to session */ }
  }
}
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | * | NextAuth.js API handler |
| `/api/auth/register` | POST | User registration endpoint |
| `/api/user/profile` | GET | Get authenticated user profile |
| `/api/user/orders` | GET | Get user's order history |

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `AuthProvider` | Client | NextAuth.js session provider wrapper |
| `LoginPage` | Client | Login form with email/password and Google OAuth |
| `RegisterPage` | Client | Registration form with validation |
| `AccountPage` | Server | User profile and settings |
| `OrderHistory` | Server | List of user's orders |
| `AuthButton` | Client | Header login/logout/account dropdown |
| `ProtectedRoute` | Client | Wrapper for auth-required pages |

## Testing Strategy

### Unit Tests
- Form validation (email, password strength, matching)
- NextAuth.js adapter functions
- Session token handling
- Password hashing (bcrypt)

### Integration Tests
- Registration flow with Sanity user creation
- Login with credentials provider
- Google OAuth mock flow
- Session persistence and expiration
- Protected route redirect behavior

### E2E Tests (Playwright)
- Full registration → login → account access flow
- Login → checkout → order creation flow
- Session persistence across browser restart
- Logout and session invalidation
- OAuth flow with mock Google provider

## Dependencies

### Depends On
- Sanity CMS for user data storage
- NextAuth.js v5 library
- Google OAuth credentials (optional)

### Depended On By
- `cart-checkout`: Checkout requires user identification
- `admin-panel`: Admin access requires authentication

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Password security (storage, hashing) | High | Use bcrypt, never store plain text, enforce strength |
| CSRF and session hijacking | High | NextAuth.js handles CSRF tokens, use httpOnly cookies |
| Google OAuth scope creep | Low | Request minimal scopes (email, profile only) |
| Account enumeration attacks | Medium | Use generic error messages, rate limit login attempts |
| Session fixation | Medium | Regenerate session on login, use JWT strategy |
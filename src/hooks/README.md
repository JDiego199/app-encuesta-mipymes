# Password Management Hooks

This module provides React hooks for managing user passwords using Supabase authentication.

## Hooks

### `usePasswordChange()`

Hook for changing the current user's password. Validates the current password before updating.

```typescript
import { usePasswordChange } from '@/hooks/usePasswordManagement'

const { mutate: changePassword, isPending, error } = usePasswordChange()

// Usage
changePassword({
  currentPassword: 'current123',
  newPassword: 'newpassword123',
  confirmPassword: 'newpassword123'
})
```

### `usePasswordReset()`

Hook for requesting a password reset email.

```typescript
import { usePasswordReset } from '@/hooks/usePasswordManagement'

const { mutate: resetPassword, isPending, error } = usePasswordReset()

// Usage
resetPassword({
  email: 'user@example.com'
})
```

### `usePasswordResetConfirmation()`

Hook for confirming password reset with a token (used on the reset password page).

```typescript
import { usePasswordResetConfirmation } from '@/hooks/usePasswordManagement'

const { mutate: confirmReset, isPending, error } = usePasswordResetConfirmation()

// Usage
confirmReset({
  token: 'reset-token-from-url',
  newPassword: 'newpassword123',
  confirmPassword: 'newpassword123'
})
```

## Types

### `PasswordChangeRequest`
```typescript
interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
```

### `PasswordResetRequest`
```typescript
interface PasswordResetRequest {
  email: string
}
```

### `PasswordResetConfirmation`
```typescript
interface PasswordResetConfirmation {
  token: string
  newPassword: string
  confirmPassword: string
}
```

### `PasswordErrorType`
Enum with all possible error types:
- `INVALID_CURRENT_PASSWORD`
- `WEAK_PASSWORD`
- `PASSWORD_MISMATCH`
- `INVALID_TOKEN`
- `EXPIRED_TOKEN`
- `EMAIL_NOT_FOUND`
- `NETWORK_ERROR`
- `UNKNOWN_ERROR`

## Validation

The module includes client-side validation utilities:

### `validatePasswordChangeForm(currentPassword, newPassword, confirmPassword)`
Validates a complete password change form.

### `validateEmail(email)`
Validates email format.

### `validatePasswordStrength(password)`
Validates password meets minimum requirements (6+ characters).

## Error Handling

All hooks provide comprehensive error handling with Spanish error messages. Errors are automatically displayed using toast notifications and can also be accessed through the hook's error state.

## Integration with Supabase

The hooks integrate seamlessly with Supabase Auth:
- Uses `supabase.auth.updateUser()` for password changes
- Uses `supabase.auth.resetPasswordForEmail()` for password reset requests
- Uses `supabase.auth.verifyOtp()` for token verification
- Automatically maps Supabase errors to user-friendly Spanish messages

## Requirements Covered

This implementation covers the following requirements:
- 1.1, 1.2, 1.3, 1.5, 1.6: Password change functionality
- 2.1, 2.2, 2.3: Password reset functionality  
- 4.1, 4.2, 4.3, 4.4, 4.5: Supabase integration and error handling
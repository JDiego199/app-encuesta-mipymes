import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ForgotPasswordForm } from '../ForgotPasswordForm'

// Mock the password management hook
const mockMutateAsync = vi.fn()
vi.mock('@/hooks/usePasswordManagement', () => ({
  usePasswordReset: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}))

// Mock Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('ForgotPasswordForm', () => {
  const mockOnSuccess = vi.fn()
  const mockOnCancel = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockMutateAsync.mockResolvedValue({ success: true })
  })

  it('renders form correctly', () => {
    render(
      <ForgotPasswordForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Recuperar Contraseña')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar email de recuperación/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /volver al login/i })).toBeInTheDocument()
  })

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup()
    
    render(
      <ForgotPasswordForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    )

    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('El email es requerido')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    
    render(
      <ForgotPasswordForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    )

    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'invalid-email')

    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    await user.click(submitButton)

    // Check that the form doesn't submit with invalid email
    // The validation should prevent submission
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('submits form with valid email', async () => {
    const user = userEvent.setup()
    
    render(
      <ForgotPasswordForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    )

    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ email: 'test@example.com' })
    })
  })

  it('shows success state after successful submission', async () => {
    const user = userEvent.setup()
    
    render(
      <ForgotPasswordForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    )

    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email Enviado')).toBeInTheDocument()
      expect(screen.getByText(/se ha enviado un email con instrucciones/i)).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  it('shows error message on submission failure', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockResolvedValue({ 
      success: false, 
      error: { message: 'Email no encontrado' } 
    })
    
    render(
      <ForgotPasswordForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    )

    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email no encontrado')).toBeInTheDocument()
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ForgotPasswordForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    )

    const cancelButton = screen.getByRole('button', { name: /volver al login/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('calls onCancel when back button is clicked in success state', async () => {
    const user = userEvent.setup()
    
    render(
      <ForgotPasswordForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    )

    // First submit to get to success state
    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'test@example.com')

    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email Enviado')).toBeInTheDocument()
    })

    // Click back button in success state
    const backButton = screen.getByRole('button', { name: /volver al login/i })
    await user.click(backButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('clears error when user starts typing', async () => {
    const user = userEvent.setup()
    
    render(
      <ForgotPasswordForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    )

    // First trigger validation error
    const submitButton = screen.getByRole('button', { name: /enviar email de recuperación/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('El email es requerido')).toBeInTheDocument()
    })

    // Start typing to clear error
    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'test')

    await waitFor(() => {
      expect(screen.queryByText('El email es requerido')).not.toBeInTheDocument()
    })
  })
})
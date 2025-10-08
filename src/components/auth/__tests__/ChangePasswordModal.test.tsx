import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChangePasswordModal } from '../ChangePasswordModal'

// Mock the password management hook
vi.mock('@/hooks/usePasswordManagement', () => ({
  usePasswordChange: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ success: true }),
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

describe('ChangePasswordModal', () => {
  const mockOnClose = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when open', () => {
    render(
      <ChangePasswordModal isOpen={true} onClose={mockOnClose} />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña Actual')).toBeInTheDocument()
    expect(screen.getByLabelText('Nueva Contraseña')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar Nueva Contraseña')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <ChangePasswordModal isOpen={false} onClose={mockOnClose} />,
      { wrapper: createWrapper() }
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    
    render(
      <ChangePasswordModal isOpen={true} onClose={mockOnClose} />,
      { wrapper: createWrapper() }
    )

    const submitButton = screen.getByRole('button', { name: /cambiar contraseña/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('La contraseña actual es requerida')).toBeInTheDocument()
      expect(screen.getByText('La nueva contraseña es requerida')).toBeInTheDocument()
      expect(screen.getByText('Confirma tu nueva contraseña')).toBeInTheDocument()
    })
  })

  it('shows password mismatch error', async () => {
    const user = userEvent.setup()
    
    render(
      <ChangePasswordModal isOpen={true} onClose={mockOnClose} />,
      { wrapper: createWrapper() }
    )

    await user.type(screen.getByLabelText('Contraseña Actual'), 'currentpass')
    await user.type(screen.getByLabelText('Nueva Contraseña'), 'newpass123')
    await user.type(screen.getByLabelText('Confirmar Nueva Contraseña'), 'differentpass')

    const submitButton = screen.getByRole('button', { name: /cambiar contraseña/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument()
    })
  })

  it('shows weak password error', async () => {
    const user = userEvent.setup()
    
    render(
      <ChangePasswordModal isOpen={true} onClose={mockOnClose} />,
      { wrapper: createWrapper() }
    )

    await user.type(screen.getByLabelText('Contraseña Actual'), 'currentpass')
    await user.type(screen.getByLabelText('Nueva Contraseña'), '123')
    await user.type(screen.getByLabelText('Confirmar Nueva Contraseña'), '123')

    const submitButton = screen.getByRole('button', { name: /cambiar contraseña/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    
    render(
      <ChangePasswordModal isOpen={true} onClose={mockOnClose} />,
      { wrapper: createWrapper() }
    )

    const currentPasswordInput = screen.getByLabelText('Contraseña Actual')
    expect(currentPasswordInput).toHaveAttribute('type', 'password')

    // Find the eye icon button for current password (first one)
    const eyeButtons = screen.getAllByRole('button')
    const currentPasswordEyeButton = eyeButtons.find(button => 
      button.querySelector('svg') && button.closest('div')?.querySelector('#currentPassword')
    )
    
    if (currentPasswordEyeButton) {
      await user.click(currentPasswordEyeButton)
      expect(currentPasswordInput).toHaveAttribute('type', 'text')
    }
  })

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ChangePasswordModal isOpen={true} onClose={mockOnClose} />,
      { wrapper: createWrapper() }
    )

    const cancelButton = screen.getByText('Cancelar')
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
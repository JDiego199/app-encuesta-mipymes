import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Key } from 'lucide-react'
import { ChangePasswordModal } from '@/components/auth/ChangePasswordModal'
import { BiDataLogo } from '@/components/ui/BiDataLogo'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

  return (
    <header className="bg-white border-b border-bidata-gray/20 px-4 sm:px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section - Left */}
        <div className="flex items-center">
          <BiDataLogo className="flex-shrink-0" height={32} />
        </div>

        {/* Profile Menu - Right */}
        <div className="flex items-center">
          {user && profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-bidata-cyan/10">
                  <User className="h-5 w-5 text-bidata-dark" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-3 py-3 border-b">
                  <p className="text-sm font-medium text-bidata-dark">{profile.nombre_persona}</p>
                  <p className="text-xs text-bidata-gray">{profile.razon_social}</p>
                  <p className="text-xs text-bidata-gray">{user.email}</p>
                </div>
                <DropdownMenuItem 
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="hover:bg-bidata-cyan/10"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Cambiar Contraseña
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="hover:bg-red-50 text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </header>
  )
}
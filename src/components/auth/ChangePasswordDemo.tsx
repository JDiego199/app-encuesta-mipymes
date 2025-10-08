import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChangePasswordModal } from './ChangePasswordModal'

export function ChangePasswordDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-bidata-dark">Demo: Change Password Modal</h1>
      <p className="text-bidata-gray">
        Click the button below to test the ChangePasswordModal component.
      </p>
      
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="bg-bidata-cyan hover:bg-bidata-cyan/90 text-white"
      >
        Open Change Password Modal
      </Button>

      <ChangePasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
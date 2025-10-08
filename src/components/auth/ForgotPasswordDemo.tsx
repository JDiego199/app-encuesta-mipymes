import React, { useState } from 'react'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { Button } from '@/components/ui/button'

export function ForgotPasswordDemo() {
  const [showForm, setShowForm] = useState(false)

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ForgotPasswordForm
          onSuccess={() => {
            console.log('Password reset email sent successfully')
            // In a real app, this would navigate back to login
            setTimeout(() => setShowForm(false), 3000)
          }}
          onCancel={() => {
            console.log('User cancelled password reset')
            setShowForm(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-bidata-dark">ForgotPasswordForm Demo</h1>
        <p className="text-bidata-gray">Click the button below to test the forgot password form</p>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-bidata-cyan hover:bg-bidata-cyan/90 text-white"
        >
          Show Forgot Password Form
        </Button>
      </div>
    </div>
  )
}
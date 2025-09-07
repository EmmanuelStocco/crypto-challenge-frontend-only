'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPayment } from '../services/paymentService'
import { v4 as uuidv4 } from 'uuid'

interface PaymentData {
  amount: number
  description: string
}

export default function PaymentForm() {
  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    description: ''
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createPayment,
    onSuccess: (response) => {
      if (response.status === 201) {
        setMessage({ type: 'success', text: 'Payment created successfully!' })
        queryClient.invalidateQueries({ queryKey: ['payments'] })
      } else if (response.status === 409) {
        setMessage({ type: 'info', text: 'Payment already exists (idempotency)' })
      }
      setFormData({ amount: 0, description: '' })
    },
    onError: (error: any) => {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to create payment' 
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (formData.amount <= 0) {
      setMessage({ type: 'error', text: 'Amount must be greater than 0' })
      return
    }

    if (!formData.description.trim()) {
      setMessage({ type: 'error', text: 'Description is required' })
      return
    }

    const idempotencyKey = uuidv4()
    mutation.mutate({
      ...formData,
      idempotencyKey
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Payment description..."
          required
        />
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.isLoading ? 'Creating Payment...' : 'Create Payment'}
      </button>
    </form>
  )
}

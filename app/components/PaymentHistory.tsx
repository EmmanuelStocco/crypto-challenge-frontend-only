'use client'

import { useQuery } from '@tanstack/react-query'
import { getPayments } from '../services/paymentService'

export default function PaymentHistory() {
  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
    refetchInterval: 5000, // Refetch every 5 seconds
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading payments...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Failed to load payments</div>
        <div className="text-sm text-gray-500">
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No payments found. Create your first payment!
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {payments.map((payment: any) => (
        <div
          key={payment.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-semibold text-lg text-gray-900">
              ${payment.amount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(payment.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="text-gray-700 mb-2">
            {payment.description}
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              payment.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {payment.status}
            </span>
            <span className="text-gray-500 font-mono text-xs">
              ID: {payment.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

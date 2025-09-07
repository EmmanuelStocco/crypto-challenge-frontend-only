import PaymentForm from './components/PaymentForm'
import PaymentHistory from './components/PaymentHistory'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Validation System
          </h1>
          <p className="text-lg text-gray-600">
            Create and validate payment transactions with idempotency support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Create Payment
            </h2>
            <PaymentForm />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Payment History
            </h2>
            <PaymentHistory />
          </div>
        </div>
      </div>
    </main>
  )
}

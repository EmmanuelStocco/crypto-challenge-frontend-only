import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const SUPER_SECRET_TOKEN = process.env.NEXT_PUBLIC_SUPER_SECRET_TOKEN || 'your_super_secret_token_here'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${SUPER_SECRET_TOKEN}`,
    'Content-Type': 'application/json',
  },
})

export interface CreatePaymentRequest {
  amount: number
  description: string
  idempotencyKey: string
}

export interface Payment {
  id: string
  amount: number
  description: string
  idempotencyKey: string
  status: string
  createdAt: string
  updatedAt: string
}

export const createPayment = async (data: CreatePaymentRequest) => {
  const response = await api.post('/api/payments', {
    amount: data.amount,
    description: data.description,
  }, {
    headers: {
      'X-Idempotency-Key': data.idempotencyKey,
    },
  })
  return response
}

export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get('/api/payments')
  return response.data
}

export const getPaymentById = async (id: string): Promise<Payment> => {
  const response = await api.get(`/api/payments/${id}`)
  return response.data
}

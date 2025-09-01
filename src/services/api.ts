const API_BASE_URL = "http://localhost:5000/api"
export interface SendOTPRequest {
  email: string
  name?: string
  dateOfBirth?: string
}

export interface VerifyOTPRequest {
  email: string
  otp: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

export interface User {
  id: string
  email: string
  name: string
  isVerified: boolean
}

export interface AuthResponse {
  user: User
  token: string
}

export const authApi = {
  async sendOTP(data: SendOTPRequest): Promise<ApiResponse<{ email: string; expiresIn: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to send OTP")
    }

    return response.json()
  },

  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to verify OTP")
    }

    return response.json()
  },
}

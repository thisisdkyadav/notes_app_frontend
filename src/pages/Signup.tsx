import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authApi } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import logoSvg from "../assets/logo.svg"
import blueImageSvg from "../assets/blue_image.svg"

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    dateOfBirth: "",
  })
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSendOTP = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await authApi.sendOTP({
        email: formData.email,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
      })

      if (response.success) {
        setOtpSent(true)
        setSuccess("OTP sent to your email!")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await authApi.verifyOTP({ email: formData.email, otp })

      if (response.success && response.data) {
        login(response.data.user, response.data.token)
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otpSent) {
      await handleSendOTP()
    } else {
      await handleVerifyOTP()
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 lg:px-12 lg:py-12 bg-white">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <img src={logoSvg} alt="HD Logo" className="h-8 w-8" />
            <span className="ml-3 text-xl font-bold text-gray-900">HD</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
            <p className="text-gray-600 text-sm">Sign up to enjoy the feature of HD</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm text-gray-600 mb-1">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={otpSent}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50"
                placeholder="Jonas Khanwald"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Date of Birth Input */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm text-gray-600 mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                disabled={otpSent}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={otpSent}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50"
                placeholder="jonas_khanwald@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* OTP Input - Shows after OTP is sent */}
            {otpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm text-gray-600 mb-1">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    setError("")
                  }}
                />
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 p-3">
                <div className="text-sm text-green-700">{success}</div>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={loading || (otpSent && otp.length !== 6)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (otpSent ? "Verifying..." : "Sending OTP...") : otpSent ? "Verify OTP" : "Get OTP"}
            </button>

            {/* Resend OTP - Shows after OTP is sent */}
            {otpSent && (
              <div className="text-center">
                <button type="button" onClick={handleSendOTP} disabled={loading} className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50">
                  Didn't receive the code? Resend
                </button>
              </div>
            )}
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Blue background image */}
      <div className="hidden lg:block flex-1 relative">
        <img src={blueImageSvg} alt="Blue Abstract Background" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  )
}

export default Signup

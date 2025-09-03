import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authApi } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import LoginWithGoogle from "../components/LoginWithGoogle"
import FloatingLabelInput from "../components/FloatingLabelInput"
import logoSvg from "../assets/logo.svg"
import blueImageSvg from "../assets/blue_image.svg"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSendOTP = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await authApi.sendOTP({ email })

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
      const response = await authApi.verifyOTP({ email, otp })

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

  const handleGoogleLogin = async (googleToken: string) => {
    setLoading(true)
    setError("")

    try {
      const response = await authApi.loginWithGoogle(googleToken)

      if (response.success && response.data) {
        login(response.data.user, response.data.token)
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed")
    } finally {
      setLoading(false)
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
            <span className="ml-3 text-xl font-bold" style={{ color: "#232323" }}>
              HD
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#232323" }}>
              Sign in
            </h1>
            <p className="text-sm" style={{ color: "#969696" }}>
              Please login to continue to your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <FloatingLabelInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                disabled={otpSent}
                required
                placeholder="jonas_khanwald@gmail.com"
              />
            </div>

            {/* OTP Input - Shows after OTP is sent */}
            {otpSent && (
              <div>
                <FloatingLabelInput
                  id="otp"
                  name="otp"
                  type="text"
                  label="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    setError("")
                  }}
                  required
                  maxLength={6}
                  placeholder="000000"
                  className="text-center text-lg tracking-widest"
                />
              </div>
            )}

            {/* Keep me logged in - Only show if OTP not sent yet */}
            {!otpSent && (
              <div className="flex items-center">
                <input id="remember" name="remember" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember" className="ml-2 block text-sm" style={{ color: "#969696" }}>
                  Keep me logged in
                </label>
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
            <button type="submit" disabled={loading || (otpSent && otp.length !== 6)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ width: "399px", maxWidth: "100%", height: "59px" }}>
              {loading ? (otpSent ? "Verifying..." : "Sending OTP...") : otpSent ? "Verify OTP" : "Send OTP"}
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

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white" style={{ color: "#969696" }}>
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Google Login */}
          <LoginWithGoogle callback={handleGoogleLogin} />

          {/* Sign Up Link */}
          <p className="text-center text-sm mt-6" style={{ color: "#969696" }}>
            Need an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Blue background image */}
      <div className="hidden lg:block flex-1 p-3">
        <div className="relative h-full w-full rounded-2xl overflow-hidden">
          <img src={blueImageSvg} alt="Blue Abstract Background" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default Login

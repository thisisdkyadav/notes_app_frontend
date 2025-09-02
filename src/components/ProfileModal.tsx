import React, { useState, useEffect } from "react"
import { authApi, type UpdateProfileRequest } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, token, login } = useAuth()
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: "",
    dateOfBirth: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await authApi.updateProfile(formData, token)

      if (response.success && response.data) {
        // Update the user in auth context
        login(response.data, token)
        setSuccess("Profile updated successfully!")
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-20 h-20 rounded-full border-4 border-blue-200" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
            )}
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Account Type:</span>
                <p className="text-gray-900">{user?.authProvider === "google" ? "Google Account" : "Email Account"}</p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input id="name" name="name" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input id="dateOfBirth" name="dateOfBirth" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={formData.dateOfBirth} onChange={handleInputChange} />
            </div>

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

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal

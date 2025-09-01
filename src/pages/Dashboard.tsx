import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import logoSvg from "../assets/logo.svg"

interface Note {
  id: number
  title: string
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notes] = useState<Note[]>([
    { id: 1, title: "Note 1" },
    { id: 2, title: "Note 2" },
  ])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logoSvg} alt="HD Logo" className="h-6 w-6" />
            <span className="ml-2 text-lg font-bold text-gray-900">HD</span>
            <h1 className="ml-6 text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome, {user?.name?.split(" ")[0]} {user?.name?.split(" ")[1]} !
          </h2>
          <p className="text-gray-600 text-sm">Email: {user?.email || ""}</p>
        </div>

        {/* Create Note Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-6">Create Note</button>

        {/* Notes Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                <span className="text-gray-900 font-medium">{note.title}</span>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { notesApi, type Note } from "../services/notesApi"
import CreateNoteModal from "../components/CreateNoteModal"
import EditNoteModal from "../components/EditNoteModal"
import NoteItem from "../components/NoteItem"
import logoSvg from "../assets/logo.svg"

const Dashboard: React.FC = () => {
  const { user, logout, token } = useAuth()
  const navigate = useNavigate()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const fetchNotes = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError("")
      const response = await notesApi.getNotes(
        {
          search: searchTerm || undefined,
          limit: 50,
        },
        token
      )

      if (response.success && response.data) {
        setNotes(response.data.notes)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch notes")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!token || !confirm("Are you sure you want to delete this note?")) return

    try {
      await notesApi.deleteNote(noteId, token)
      await fetchNotes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note")
    }
  }

  const handleTogglePin = async (noteId: string, isPinned: boolean) => {
    if (!token) return

    try {
      await notesApi.updateNote(noteId, { isPinned }, token)
      await fetchNotes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update note")
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowEditModal(true)
  }

  const handleSearch = () => {
    fetchNotes()
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    fetchNotes()
  }

  useEffect(() => {
    fetchNotes()
  }, [token])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== "") {
        fetchNotes()
      } else if (searchTerm === "") {
        fetchNotes()
      }
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

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

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input type="text" placeholder="Search notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Create Note Button */}
        <button onClick={() => setShowCreateModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-6">
          Create Note
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            <span className="text-sm text-gray-500">{loading ? "Loading..." : `${notes.length} note${notes.length !== 1 ? "s" : ""}`}</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M18 20a6 6 0 1112 0v2a6 6 0 01-12 0v-2zM22 20h4" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No notes found</h3>
              <p className="text-sm text-gray-500">{searchTerm ? "Try a different search term" : "Create your first note to get started"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <NoteItem key={note._id} note={note} onEdit={handleEditNote} onDelete={handleDeleteNote} onTogglePin={handleTogglePin} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateNoteModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onNoteCreated={fetchNotes} />

      <EditNoteModal
        isOpen={showEditModal}
        note={editingNote}
        onClose={() => {
          setShowEditModal(false)
          setEditingNote(null)
        }}
        onNoteUpdated={fetchNotes}
      />
    </div>
  )
}

export default Dashboard

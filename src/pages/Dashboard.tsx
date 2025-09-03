import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { notesApi, type Note } from "../services/notesApi"
import CreateNoteModal from "../components/CreateNoteModal"
import EditNoteModal from "../components/EditNoteModal"
import ProfileModal from "../components/ProfileModal"
import NoteDetailModal from "../components/NoteDetailModal"
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
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [currentView, setCurrentView] = useState<"active" | "archived">("active")
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const fetchNotes = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError("")

      // Fetch active notes
      const activeResponse = await notesApi.getNotes(
        {
          search: searchTerm || undefined,
          limit: 50,
          isArchived: false,
        },
        token
      )

      // Fetch archived notes
      const archivedResponse = await notesApi.getNotes(
        {
          search: searchTerm || undefined,
          limit: 50,
          isArchived: true,
        },
        token
      )

      if (activeResponse.success && activeResponse.data) {
        setNotes(activeResponse.data.notes)
      }

      if (archivedResponse.success && archivedResponse.data) {
        setArchivedNotes(archivedResponse.data.notes)
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

  const handleToggleArchive = async (noteId: string, isArchived: boolean) => {
    if (!token) return

    try {
      await notesApi.updateNote(noteId, { isArchived }, token)
      await fetchNotes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update note")
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowEditModal(true)
  }

  const handleViewNote = (note: Note) => {
    setViewingNote(note)
    setShowDetailModal(true)
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
          </div>

          <div className="flex items-center gap-3">
            {/* Profile Card */}
            <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full border-2 border-blue-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name?.split(" ")[0]}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button onClick={handleLogout} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        {/* Welcome Section - Mobile Only */}
        <div className="mb-6 md:hidden">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(" ")[0]}!</h2>
          <p className="text-gray-600 text-sm">Manage your notes and stay organized.</p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Desktop Header with Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="relative">
                <input type="text" placeholder="Search notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-80 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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

              {/* Toggle Switch for Active/Archive */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button onClick={() => setCurrentView("active")} className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${currentView === "active" ? "bg-white text-blue-700 shadow-sm border border-blue-200" : "text-gray-600 hover:text-gray-800"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Active</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{notes.length}</span>
                </button>
                <button
                  onClick={() => setCurrentView("archived")}
                  className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${currentView === "archived" ? "bg-white text-blue-700 shadow-sm border border-blue-200" : "text-gray-600 hover:text-gray-800"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                  </svg>
                  <span>Archived</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{archivedNotes.length}</span>
                </button>
              </div>
            </div>

            {/* Create Note Button - Extreme Right */}
            <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Note
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* View Tabs - Mobile */}
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setCurrentView("active")} className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${currentView === "active" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600"}`}>
              Active ({notes.length})
            </button>
            <button onClick={() => setCurrentView("archived")} className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${currentView === "archived" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600"}`}>
              Archived ({archivedNotes.length})
            </button>
          </div>

          {/* Search Bar - Mobile */}
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

          {/* Create Note Button - Mobile */}
          <button onClick={() => setShowCreateModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-6">
            Create Note
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{currentView === "active" ? "Active Notes" : "Archived Notes"}</h3>
            <span className="text-sm text-gray-500">{loading ? "Loading..." : `${currentView === "active" ? notes.length : archivedNotes.length} note${(currentView === "active" ? notes.length : archivedNotes.length) !== 1 ? "s" : ""}`}</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (currentView === "active" ? notes.length === 0 : archivedNotes.length === 0) ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M18 20a6 6 0 1112 0v2a6 6 0 01-12 0v-2zM22 20h4" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{currentView === "active" ? "No active notes found" : "No archived notes found"}</h3>
              <p className="text-sm text-gray-500">{searchTerm ? "Try a different search term" : currentView === "active" ? "Create your first note to get started" : "Archive some notes to see them here"}</p>
            </div>
          ) : (
            <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
              {(currentView === "active" ? notes : archivedNotes).map((note) => (
                <NoteItem key={note._id} note={note} onEdit={handleEditNote} onDelete={handleDeleteNote} onTogglePin={handleTogglePin} onToggleArchive={handleToggleArchive} showArchiveOption={true} onView={handleViewNote} />
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

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      <NoteDetailModal
        isOpen={showDetailModal}
        note={viewingNote}
        onClose={() => {
          setShowDetailModal(false)
          setViewingNote(null)
        }}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        onTogglePin={handleTogglePin}
        onToggleArchive={handleToggleArchive}
      />
    </div>
  )
}

export default Dashboard

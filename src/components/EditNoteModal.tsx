import React, { useState, useEffect } from "react"
import { notesApi, type Note, type UpdateNoteRequest } from "../services/notesApi"
import { useAuth } from "../contexts/AuthContext"

interface EditNoteModalProps {
  isOpen: boolean
  note: Note | null
  onClose: () => void
  onNoteUpdated: () => void
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ isOpen, note, onClose, onNoteUpdated }) => {
  const [formData, setFormData] = useState<UpdateNoteRequest>({
    title: "",
    content: "",
    tags: [],
    isPinned: false,
    isArchived: false,
  })
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags || [],
        isPinned: note.isPinned,
        isArchived: note.isArchived,
      })
    }
  }, [note])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim().toLowerCase()],
      })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !note) return

    setLoading(true)
    setError("")

    try {
      await notesApi.updateNote(note._id, formData, token)
      onNoteUpdated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update note")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !note) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Edit Note</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter note title..."
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            {/* Content Input */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Write your note content..."
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>

            {/* Tags Input */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  id="tags"
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add
                </button>
              </div>

              {/* Display Tags */}
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2">
              <div className="flex items-center">
                <input id="isPinned" name="isPinned" type="checkbox" checked={formData.isPinned} onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-700">
                  Pin this note
                </label>
              </div>

              <div className="flex items-center">
                <input id="isArchived" name="isArchived" type="checkbox" checked={formData.isArchived} onChange={(e) => setFormData({ ...formData, isArchived: e.target.checked })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="isArchived" className="ml-2 block text-sm text-gray-700">
                  Archive this note
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Updating..." : "Update Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditNoteModal


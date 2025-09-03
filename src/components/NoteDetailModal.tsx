import React from "react"
import { type Note } from "../services/notesApi"
import Modal from "./Modal"

interface NoteDetailModalProps {
  isOpen: boolean
  note: Note | null
  onClose: () => void
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string, isPinned: boolean) => void
  onToggleArchive?: (id: string, isArchived: boolean) => void
}

const NoteDetailModal: React.FC<NoteDetailModalProps> = ({ isOpen, note, onClose, onEdit, onDelete, onTogglePin, onToggleArchive }) => {
  if (!note) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      onDelete(note._id)
      onClose()
    }
  }

  const handleTogglePin = () => {
    onTogglePin(note._id, !note.isPinned)
  }

  const handleToggleArchive = () => {
    if (onToggleArchive) {
      onToggleArchive(note._id, !note.isArchived)
    }
  }

  const handleEdit = () => {
    onEdit(note)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" title="Note Details">
      <div className="p-6">
        {/* Header with Title and Status */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{note.title}</h1>
            <div className="flex items-center gap-2 ml-4">
              {note.isPinned && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Pinned
                </div>
              )}
              {note.isArchived && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                  </svg>
                  Archived
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Created: {formatDate(note.createdAt)}</span>
            {note.createdAt !== note.updatedAt && <span>Updated: {formatDate(note.updatedAt)}</span>}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">{note.content}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {!note.isArchived && (
              <button onClick={handleTogglePin} className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${note.isPinned ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {note.isPinned ? "Unpin" : "Pin"}
              </button>
            )}

            {onToggleArchive && (
              <button onClick={handleToggleArchive} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={note.isArchived ? "M5 8l6 6 6-6" : "M5 10l7-7m0 0l7 7m-7-7v18"} />
                </svg>
                {note.isArchived ? "Unarchive" : "Archive"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>

            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default NoteDetailModal

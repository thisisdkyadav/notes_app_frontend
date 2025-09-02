const API_BASE_URL = "http://localhost:5000/api"

export interface Note {
  _id: string
  title: string
  content: string
  userId: string
  tags?: string[]
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNoteRequest {
  title: string
  content: string
  tags?: string[]
  isPinned?: boolean
}

export interface UpdateNoteRequest {
  title?: string
  content?: string
  tags?: string[]
  isPinned?: boolean
  isArchived?: boolean
}

export interface NotesResponse {
  notes: Note[]
  pagination: {
    currentPage: number
    totalPages: number
    totalNotes: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

export interface NotesQueryParams {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  isPinned?: boolean
  isArchived?: boolean
}

export const notesApi = {
  async createNote(data: CreateNoteRequest, token: string): Promise<ApiResponse<Note>> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create note")
    }

    return response.json()
  },

  async getNotes(params: NotesQueryParams = {}, token: string): Promise<ApiResponse<NotesResponse>> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.append("page", params.page.toString())
    if (params.limit) searchParams.append("limit", params.limit.toString())
    if (params.search) searchParams.append("search", params.search)
    if (params.tags) params.tags.forEach((tag) => searchParams.append("tags", tag))
    if (params.isPinned !== undefined) searchParams.append("isPinned", params.isPinned.toString())
    if (params.isArchived !== undefined) searchParams.append("isArchived", params.isArchived.toString())

    const queryString = searchParams.toString()
    const url = `${API_BASE_URL}/notes${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch notes")
    }

    return response.json()
  },

  async getNoteById(id: string, token: string): Promise<ApiResponse<Note>> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch note")
    }

    return response.json()
  },

  async updateNote(id: string, data: UpdateNoteRequest, token: string): Promise<ApiResponse<Note>> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update note")
    }

    return response.json()
  },

  async deleteNote(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete note")
    }

    return response.json()
  },
}


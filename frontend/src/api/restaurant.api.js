const API_URL = "http://localhost:5000/api";

// Helper function for handling fetch errors
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getFavorites() {
  try {
    const res = await fetch(`${API_URL}/favorites`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(res);
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    throw error;
  }
}

export async function addFavorite(id) {
  try {
    const res = await fetch(`${API_URL}/restaurants/${id}/favorite`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(res);
  } catch (error) {
    console.error(`Failed to add favorite for restaurant ${id}:`, error);
    throw error;
  }
}

export async function removeFavorite(id) {
  try {
    const res = await fetch(`${API_URL}/restaurants/${id}/favorite`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(res);
  } catch (error) {
    console.error(`Failed to remove favorite for restaurant ${id}:`, error);
    throw error;
  }
}

export async function getRestaurantById(id) {
  try {
    const res = await fetch(`${API_URL}/restaurants/${id}`);
    return handleResponse(res);
  } catch (error) {
    console.error(`Failed to fetch restaurant ${id}:`, error);
    throw error;
  }
}

export async function getUserStats() {
  try {
    const res = await fetch(`${API_URL}/users/me/stats`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return handleResponse(res);
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    throw error;
  }
}

export async function getRestaurants(search = "", page = 1, limit = 6, filters = {}) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page);
    params.append("limit", limit);
    if (filters.category && filters.category !== "ทั้งหมด") 
      params.append("category", filters.category);
    if (filters.min_rating) 
      params.append("min_rating", filters.min_rating);
    if (filters.open_now) 
      params.append("open_now", "true");

    const res = await fetch(`${API_URL}/restaurants?${params.toString()}`);
    return handleResponse(res);
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    throw error;
  }
}

export async function addRating(id, score, comment = "", imageFile = null) {
  try {
    const formData = new FormData();
    formData.append("score", score);
    if (comment) formData.append("comment", comment);
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch(`${API_URL}/restaurants/${id}/rating`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(), // ไม่ใส่ Content-Type เพราะ FormData จัดการเอง
      },
      body: formData,
    });
    return handleResponse(res);
  } catch (error) {
    console.error(`Failed to add rating for restaurant ${id}:`, error);
    throw error;
  }
}

export async function getRestaurantReviews(id) {
  try {
    const res = await fetch(`${API_URL}/restaurants/${id}/reviews`);
    return handleResponse(res);
  } catch (error) {
    console.error(`Failed to fetch reviews for restaurant ${id}:`, error);
    throw error;
  }
}


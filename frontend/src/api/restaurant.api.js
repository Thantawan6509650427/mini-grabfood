const API_URL = "http://localhost:5000/api";

// Helper function for handling fetch errors
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function getRestaurants(search = "", page = 1, limit = 6) {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page);
    params.append("limit", limit);
    
    const url = `${API_URL}/restaurants${params.toString() ? "?" + params.toString() : ""}`;
    
    const res = await fetch(url);
    return handleResponse(res);
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
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

export async function addRating(id, score) {
  try {
    const res = await fetch(`${API_URL}/restaurants/${id}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    });
    return handleResponse(res);
  } catch (error) {
    console.error(`Failed to add rating for restaurant ${id}:`, error);
    throw error;
  }
}
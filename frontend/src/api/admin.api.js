import { getAuthHeaders } from "./restaurant.api";

const API_URL = "http://localhost:5000/api/admin";

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const getDashboardStats = () =>
  fetch(`${API_URL}/dashboard`, { headers: getAuthHeaders() }).then(handleResponse);

export const adminGetRestaurants = () =>
  fetch(`${API_URL}/restaurants`, { headers: getAuthHeaders() }).then(handleResponse);

export const adminCreateRestaurant = (data) =>
  fetch(`${API_URL}/restaurants`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data)
  }).then(handleResponse);

export const adminUpdateRestaurant = (id, data) =>
  fetch(`${API_URL}/restaurants/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data)
  }).then(handleResponse);

export const adminDeleteRestaurant = (id) =>
  fetch(`${API_URL}/restaurants/${id}`, {
    method: "DELETE", headers: getAuthHeaders()
  }).then(handleResponse);

export const adminGetUsers = () =>
  fetch(`${API_URL}/users`, { headers: getAuthHeaders() }).then(handleResponse);

export const adminToggleBan = (id) =>
  fetch(`${API_URL}/users/${id}/ban`, {
    method: "PATCH", headers: getAuthHeaders()
  }).then(handleResponse);

export const adminToggleAdmin = (id) =>
  fetch(`${API_URL}/users/${id}/admin`, {
    method: "PATCH", headers: getAuthHeaders()
  }).then(handleResponse);

export const adminDeleteReview = (id) =>
  fetch(`${API_URL}/reviews/${id}`, {
    method: "DELETE", headers: getAuthHeaders()
  }).then(handleResponse);

export const updateUserProfile = (name, file) => {
  const formData = new FormData();
  formData.append("name", name);
  if (file) formData.append("picture", file);

  return fetch(`http://localhost:5000/api/auth/user/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData
  }).then(handleResponse);
}
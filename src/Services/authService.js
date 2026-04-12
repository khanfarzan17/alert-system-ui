import { API_BASE_URL } from "./config";

export async function loginRequest(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const errorMessage =
      data?.message || data?.error || "Invalid email or password";
    throw new Error(errorMessage);
  }

  return data;
}

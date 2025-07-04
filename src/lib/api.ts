// src/lib/api.ts
const API_URL = "http://127.0.0.1:8000"; // change to prod URL when deployed

export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return await response.json(); // returns { access_token, token_type }
}

export async function getCourses(token: string) {
  const response = await fetch(`${API_URL}/courses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

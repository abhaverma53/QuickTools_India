import { API_URL } from "../data/tools"

export async function fetchHealth() {
  const response = await fetch(`${API_URL}/api/v1/health`, {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error("The API is not responding right now.")
  }

  return response.json()
}

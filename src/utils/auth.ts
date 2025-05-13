import api from "./api";

export async function getOrCreateToken() {
  let token: string | null = localStorage.getItem("token");
  if (!token) {
    const res = await api.post("/auth/anon");
    token = res.data.token;
    localStorage.setItem("token", token || "");
  }
  return token;
}

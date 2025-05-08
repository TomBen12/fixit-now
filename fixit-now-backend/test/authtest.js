import fetch from "node-fetch";

const API = "http://localhost:5001/api/auth";

const user = {
  username: "testuser",
  email: "testuser@example.com",
  password: "123456"
};

async function register() {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  const data = await res.json();
  console.log("Register:", data);
}

async function login() {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, password: user.password })
  });
  const data = await res.json();
  console.log("Login:", data);
  const token = data.token
  return token;
}

await register();
await login();
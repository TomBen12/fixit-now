import fetch from "node-fetch";

const API = "http://localhost:5001/api/auth";

const user = {
  username: "testuser",
  email: "testuser@example.com",
  password: "123456",
};

let token = null;

async function getToken() {
  if (token) return token;

  // Try login
  const resLogin = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, password: user.password }),
  });
  const loginData = await resLogin.json();

  if (loginData.token) {
    token = loginData.token;
    return token;
  }

  // If login failed → register
  await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  // Try login again
  const resLogin2 = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, password: user.password }),
  });
  const loginData2 = await resLogin2.json();

  token = loginData2.token;
  return token;
}

export default getToken;

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "http://localhost:5001/api/auth";

let clientToken = null;
let providerToken = null;

async function loginOrRegister({ username, email, password }) {
  try {
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (loginRes.ok) {
      const { token } = await loginRes.json();
      return token;
    }

    // Register if login failed--
    const registerRes = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const { token } = await registerRes.json();
    return token;
  } catch (err) {
    console.error("Token setup error:", err);
    return null;
  }
}

export async function getClientToken() {
  if (!clientToken) {
    clientToken = await loginOrRegister({
      username: "client",
      email: "client@example.com",
      password: "1234",
    });
  }
  return clientToken;
}

export async function getProviderToken() {
  if (!providerToken) {
    providerToken = await loginOrRegister({
      username: "provider",
      email: "provider@example.com",
      password: "1234",
    });
  }
  return providerToken;
}

// Optional: get both at once
export async function getBothTokens() {
  const [client, provider] = await Promise.all([
    getClientToken(),
    getProviderToken(),
  ]);
  return { client, provider };
}

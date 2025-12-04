import { Startup, CreateStartupInput, UpdateStartupInput, StartupListResponse, StartupResponse } from "../types/startup";

const BASE_URL = process.env.NEXT_PUBLIC_STARTUP_API_URL || "http://localhost:4000";

// helper to get authorization header
function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createStartup(data: CreateStartupInput): Promise<StartupResponse> {
  const res = await fetch(`${BASE_URL}/startups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err || "Failed to create startup");
  }

  return res.json();
}

export async function getMyStartups(): Promise<StartupListResponse> {
  const res = await fetch(`${BASE_URL}/startups`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err || "Failed to fetch startups");
  }

  return res.json();
}

export async function getStartupById(id: string): Promise<StartupResponse> {
  const res = await fetch(`${BASE_URL}/startups/${id}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err || "Startup not found");
  }

  return res.json();
}

export async function updateStartup(id: string, data: UpdateStartupInput): Promise<StartupResponse> {
  const res = await fetch(`${BASE_URL}/startups/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err || "Failed to update startup");
  }

  return res.json();
}

export async function deleteStartup(id: string): Promise<{ message?: string }> {
  const res = await fetch(`${BASE_URL}/startups/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const err = await safeParseError(res);
    throw new Error(err || "Failed to delete startup");
  }

  try {
    return (await res.json()) as { message?: string };
  } catch {
    return { message: "Deleted" };
  }
}

/** helper: try to parse JSON error safely */
async function safeParseError(res: Response): Promise<string | null> {
  try {
    const body = await res.json();
    if (body) {
      if (typeof body === "string") return body;
      if (body.message) return body.message;
      if (body.error) return body.error;
      return JSON.stringify(body);
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

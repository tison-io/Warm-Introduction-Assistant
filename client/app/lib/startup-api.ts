import { Startup, CreateStartupDto, UpdateStartupDto } from "../types/startup";

const API_URL = process.env.NEXT_PUBLIC_FOUNDER_API_URL || 'http://localhost:4000';
const BASE_URL = `${API_URL}/startups`;

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export async function createStartup(data: CreateStartupDto): Promise<Startup> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create startup");
  return res.json();
}

export async function getMyStartups(): Promise<Startup[]> {
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch startups.");
  return res.json();
}

export async function getStartupById(id: string): Promise<Startup> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Startup not found");
  return res.json();
}

export async function updateStartup(
  id: string,
  data: UpdateStartupDto
): Promise<Startup> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to Update Startup.");
  return res.json();
}

export async function deleteStartup(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to Delete Startup.");
}

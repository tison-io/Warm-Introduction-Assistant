export function decodeJwt(token: string): { userId: string } | null {
  try {
    // JWT structure is header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format.');
      return null;
    }
    
    // Decode the base64url payload (parts[1])
    const decodedPayload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    
    // Parse the JSON string
    const payload = JSON.parse(decodedPayload);

    // Ensure the payload has the expected user ID key
    if (payload.userId) {
        return { userId: payload.userId };
    }
    return null;
  } catch (e) {
    console.error('Error decoding JWT:', e);
    return null;
  }
}

export function getFounderId(): string | null {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  const payload = decodeJwt(token);
  return payload?.userId || null;
}
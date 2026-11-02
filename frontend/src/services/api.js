const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('sgms_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If body is not JSON string (e.g. FormData), don't set Content-Type header
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('sgms_token');
    localStorage.removeItem('sgms_user');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login?expired=true';
    }
    throw new Error('Session expired. Please log in again.');
  }

  // Handle blob responses (PDFs, CSVs)
  const contentType = response.headers.get('content-type');
  if (contentType && (contentType.includes('application/pdf') || contentType.includes('text/csv'))) {
    if (!response.ok) {
      throw new Error('Failed to download file');
    }
    return response.blob();
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.errors 
      ? (typeof data.errors === 'object' ? Object.values(data.errors).join(', ') : data.message)
      : `HTTP Error ${response.status}`;
    throw new Error(errorMsg);
  }

  return data?.data !== undefined ? data.data : data;
}

export function toQueryString(params = {}) {
  const clean = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '' && val !== 'undefined') {
      clean[key] = val;
    }
  }
  const qs = new URLSearchParams(clean).toString();
  return qs ? `?${qs}` : '';
}

export default apiRequest;


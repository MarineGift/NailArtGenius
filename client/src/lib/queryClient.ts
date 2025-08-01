// React Query client configuration
import { QueryClient } from '@tanstack/react-query';

// Default fetch function for API requests
const defaultQueryFn = async ({ queryKey }: { queryKey: any[] }): Promise<any> => {
  const url = queryKey[0];
  
  if (typeof url !== 'string') {
    throw new Error('Query key must start with a URL string');
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// API request function for mutations
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Create query client with defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
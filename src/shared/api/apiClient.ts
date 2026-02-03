export type ApiError = { message: string; status?: number };

export class ApiClient {
  constructor(private baseUrl: string) {}

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
      ...options,
    });

    if (!res.ok) {
      let msg = "Request failed";
      try {
        const data = await res.json();
        msg = data?.message || msg;
      } catch {}
      const err: ApiError = { message: msg, status: res.status };
      throw err;
    }

    return (await res.json()) as T;
  }
}

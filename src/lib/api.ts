export type ArticleStatus = "DRAFT" | "PUBLISHED";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: string;
  author: string;
  glyph: string;
  featured: boolean;
  readingTime: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  status: ArticleStatus;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ArticlePayload = {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: string;
  author?: string;
  glyph?: string;
  featured?: boolean;
  readingTime?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  status?: ArticleStatus;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt?: number | null;
  image?: string | null;
  category: string;
  featured: boolean;
  status: ArticleStatus;
  buttonLabel: string;
  buttonUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductPayload = {
  name: string;
  slug?: string;
  description: string;
  price: number;
  compareAt?: number | null;
  image?: string | null;
  category?: string;
  featured?: boolean;
  status?: ArticleStatus;
  buttonLabel?: string;
  buttonUrl?: string | null;
};

/** Base da API — definida em `.env` / `.env.local` como NEXT_PUBLIC_API_URL */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
export const TOKEN_KEY = "cacursos_admin_token";

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data && data.error) || `Erro ${res.status}`);
  }
  return data as T;
}

export async function adminLogin(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string; name: string } }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export async function listAdminArticles(token: string) {
  return request<{ articles: Article[] }>("/api/articles/admin/all", { token });
}

export async function getAdminArticle(token: string, id: string) {
  return request<{ article: Article }>(`/api/articles/admin/${id}`, { token });
}

export async function createArticle(token: string, payload: ArticlePayload) {
  return request<{ article: Article }>("/api/articles", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateArticle(token: string, id: string, payload: Partial<ArticlePayload>) {
  return request<{ article: Article }>(`/api/articles/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteArticle(token: string, id: string) {
  return request<{ message: string }>(`/api/articles/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function listPublicProducts() {
  return request<{ products: Product[] }>("/api/products");
}

export async function listAdminProducts(token: string) {
  return request<{ products: Product[] }>("/api/products/admin/all", { token });
}

export async function getAdminProduct(token: string, id: string) {
  return request<{ product: Product }>(`/api/products/admin/${id}`, { token });
}

export async function createProduct(token: string, payload: ProductPayload) {
  return request<{ product: Product }>("/api/products", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(token: string, id: string, payload: Partial<ProductPayload>) {
  return request<{ product: Product }>(`/api/products/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(token: string, id: string) {
  return request<{ message: string }>(`/api/products/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function uploadImage(token: string, file: File) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Falha no upload");
  return data.url as string;
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

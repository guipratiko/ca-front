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
  images?: string[];
  category: string;
  categoryId?: string | null;
  categoryRef?: { id: string; name: string; slug: string } | null;
  featured: boolean;
  status: ArticleStatus;
  buttonLabel: string;
  buttonUrl?: string | null;
  reference?: string | null;
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
  images?: string[];
  category?: string;
  categoryId?: string | null;
  featured?: boolean;
  status?: ArticleStatus;
  buttonLabel?: string;
  buttonUrl?: string | null;
  reference?: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: { products: number };
};

export type CategoryPayload = {
  name: string;
  slug?: string;
  sortOrder?: number;
  active?: boolean;
};

export function productGallery(product: Pick<Product, "image" | "images">): string[] {
  const list = [...(product.images || [])].filter(Boolean);
  if (product.image && !list.includes(product.image)) list.unshift(product.image);
  return list;
}

/** WhatsApp da vitrine de produtos (peças/ferramentas). */
export const PRODUCTS_WHATSAPP = "5562991197301";

export function productWhatsAppUrl(
  product: Pick<Product, "name" | "reference">
): string {
  const ref = product.reference?.trim();
  const lines = [
    "Olá! Vim pela vitrine CA Tools no site.",
    `Tenho interesse no produto: ${product.name}`,
  ];
  if (ref) lines.push(`Referência: ${ref}`);
  lines.push("Pode me passar mais detalhes?");

  return `https://wa.me/${PRODUCTS_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function productsWhatsAppUrl(message?: string): string {
  const text =
    message ||
    "Olá! Vim pela vitrine CA Tools no site e quero saber mais sobre os produtos.";
  return `https://wa.me/${PRODUCTS_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/** Base da API  -  definida em `.env` / EasyPanel como NEXT_PUBLIC_API_URL */
function resolveApiUrl() {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787").replace(/\/$/, "");
  // Evita Mixed Content: página HTTPS não pode chamar API em HTTP
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    raw.startsWith("http://")
  ) {
    return raw.replace(/^http:\/\//, "https://");
  }
  return raw;
}

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

  const res = await fetch(`${resolveApiUrl()}${path}`, { ...init, headers });
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

export async function listPublicProducts(params?: {
  categoryId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const q = new URLSearchParams();
  if (params?.categoryId) q.set("categoryId", params.categoryId);
  if (params?.category) q.set("category", params.category);
  if (params?.minPrice != null && Number.isFinite(params.minPrice)) {
    q.set("minPrice", String(params.minPrice));
  }
  if (params?.maxPrice != null && Number.isFinite(params.maxPrice)) {
    q.set("maxPrice", String(params.maxPrice));
  }
  const qs = q.toString();
  return request<{ products: Product[] }>(`/api/products${qs ? `?${qs}` : ""}`);
}

export async function listPublicCategories() {
  return request<{ categories: Category[] }>("/api/categories");
}

export async function listAdminCategories(token: string) {
  return request<{ categories: Category[] }>("/api/categories/admin/all", { token });
}

export async function createCategory(token: string, payload: CategoryPayload) {
  return request<{ category: Category }>("/api/categories", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(
  token: string,
  id: string,
  payload: Partial<CategoryPayload>
) {
  return request<{ category: Category }>(`/api/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(token: string, id: string) {
  return request<{ message: string; detachedProducts?: number }>(`/api/categories/${id}`, {
    method: "DELETE",
    token,
  });
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
  const res = await fetch(`${resolveApiUrl()}/api/upload`, {
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

import { getSupabaseAdmin } from "@/lib/supabase-server";

export type ProductCategory =
  | "Apparel"
  | "Accessories"
  | "Music"
  | "Prints"
  | "Digital"
  | "Other";

export type ProductStatus = "Draft" | "Published" | "Sold Out" | "Coming Soon";

export type Product = {
  id: string;
  title: string;
  category: ProductCategory;
  status: ProductStatus;
  description: string;
  price: number | null;
  imageUrl: string;
  externalUrl: string;
  accent: string;
  updatedAt: string;
};

export type CreateProductBody = {
  title: string;
  category: ProductCategory;
  status: ProductStatus;
  description?: string;
  price?: number | null;
  imageUrl?: string;
  externalUrl?: string;
};

type ProductRow = {
  id: string;
  title: string;
  category: ProductCategory;
  status: ProductStatus;
  description: string;
  price: number | string | null;
  image_url: string;
  external_url: string;
  accent: string;
  created_at: string;
  updated_at: string;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Apparel",
  "Accessories",
  "Music",
  "Prints",
  "Digital",
  "Other",
];

export const PRODUCT_STATUSES: ProductStatus[] = [
  "Draft",
  "Published",
  "Sold Out",
  "Coming Soon",
];

export function isProductCategory(value: unknown): value is ProductCategory {
  return (
    typeof value === "string" &&
    PRODUCT_CATEGORIES.includes(value as ProductCategory)
  );
}

export function isProductStatus(value: unknown): value is ProductStatus {
  return (
    typeof value === "string" &&
    PRODUCT_STATUSES.includes(value as ProductStatus)
  );
}

const productAccentPalette = ["#c4552d", "#7a5a45", "#4f6472", "#356a5b"] as const;
function normalizePrice(value: ProductRow["price"]) {
  if (value === null) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    status: row.status,
    description: row.description,
    price: normalizePrice(row.price),
    imageUrl: row.image_url,
    externalUrl: row.external_url,
    accent: row.accent,
    updatedAt: row.updated_at,
  };
}

export async function listProducts() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list products: ${error.message}`);
  }

  return (data ?? []).map((row) => mapProductRow(row as ProductRow));
}

export async function createProduct(body: CreateProductBody): Promise<Product> {
  const supabaseAdmin = getSupabaseAdmin();
  const now = Date.now();
  const id = `product-${now}`;
  const accent = productAccentPalette[now % productAccentPalette.length];

  const insertRow = {
    id,
    title: body.title.trim(),
    category: body.category,
    status: body.status,
    description: body.description?.trim() ?? "",
    price: body.price ?? null,
    image_url: body.imageUrl?.trim() || "Cover image pending",
    external_url: body.externalUrl?.trim() ?? "",
    accent,
  };

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(insertRow)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return mapProductRow(data as ProductRow);
}

export async function updateProductStatus(id: string, status: ProductStatus) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("products")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id.trim())
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update product status: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapProductRow(data as ProductRow);
}

export function resetProductsForTests() {
  // No-op for Supabase-backed storage.
}

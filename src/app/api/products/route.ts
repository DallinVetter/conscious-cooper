import type { CreateProductBody } from "@/lib/products";
import {
  createProduct,
  isProductCategory,
  isProductStatus,
  listProducts,
} from "@/lib/products";

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parsePrice(value: unknown) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return undefined;
  }

  return value;
}

export async function GET() {
  return Response.json({ products: await listProducts() });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CreateProductBody> & {
      price?: unknown;
    };

    const title = normalizeString(payload.title);
    const category = payload.category;
    const status = payload.status;
    const description = normalizeOptionalString(payload.description);
    const imageUrl = normalizeOptionalString(payload.imageUrl);
    const externalUrl = normalizeOptionalString(payload.externalUrl);
    const price = parsePrice(payload.price);

    if (!title || !isProductCategory(category) || !isProductStatus(status) || price === undefined) {
      return Response.json(
        { error: "Invalid product payload." },
        { status: 400 },
      );
    }

    const product = await createProduct({
      title,
      category,
      status,
      description,
      price,
      imageUrl,
      externalUrl,
    });

    return Response.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "Invalid product payload." },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Unexpected error while creating product." },
      { status: 500 },
    );
  }
}

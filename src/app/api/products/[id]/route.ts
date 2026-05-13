import { isProductStatus, updateProductStatus } from "@/lib/products";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as { status?: unknown };

    if (!isProductStatus(payload.status)) {
      return Response.json(
        { error: "Invalid or missing status." },
        { status: 400 },
      );
    }

    const product = await updateProductStatus(id, payload.status);

    if (!product) {
      return Response.json({ error: "Product not found." }, { status: 404 });
    }

    return Response.json({ product });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "Invalid or missing status." },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Unexpected error while updating product." },
      { status: 500 },
    );
  }
}

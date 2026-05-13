export async function GET() {
  return Response.json({
    ok: true,
    service: "conscious-cooper",
    timestamp: new Date().toISOString(),
  });
}


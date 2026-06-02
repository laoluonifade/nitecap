export async function GET() {
  return Response.json({ status: "alive", timestamp: Date.now() });
}

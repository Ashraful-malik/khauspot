import dbConnect from "@/lib/db";
export async function POST(req: Request) {
  await dbConnect();

  const { stallId, reportedBy, reason } = await req.json();
  if (!stallId || !reportedBy || !reason) {
    return new Response({ error: "Missing required fields", status: 400 });
  }
}

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Error:Missing headers", { status: 400 });
  }
  const webHookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webHookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET ");
  }
  const wh = new Webhook(webHookSecret);

  let event;
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (error) {
    return new NextResponse("Internal Signature", { status: 500 });
  }

  await connectDb();
  const { type, data } = event as WebhookEvent;
  if (type === "user.created") {
    await User.create({
      clerkId: data.id,
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      email: data.email_addresses?.[0]?.email_address,
      avatar: data.image_url,
    });
  }

  if (type === "user.updated") {
    await User.findOneAndUpdate(
      { clerkId: data.id },
      {
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        email: data.email_addresses?.[0]?.email_address,
        avatar: data.image_url,
      },
    );
  }

  if (type === "user.deleted") {
    await User.findOneAndUpdate(
      { clerkId: data.id },
      {
        name: "Deleted User",
        avatar: null,
        email: null,
        isDeleted: true,
      },
    );
  }

  return NextResponse.json({ success: true });
}

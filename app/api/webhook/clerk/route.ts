import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { IncomingHttpHeaders } from "http";
import { NextResponse } from "next/server";

import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";

// Define supported Clerk webhook events
type EventType =
  | "organization.created"
  | "organizationInvitation.created"
  | "organizationMembership.created"
  | "organizationMembership.deleted"
  | "organization.updated"
  | "organization.deleted";

type Event = {
  data: Record<string, string | number | Record<string, string>[]>;
  object: "event";
  type: EventType;
};

export const POST = async (request: Request) => {
  try {
    // Await the headers() function to get the headers list
    const headersList = await headers();

    console.log("🔍 Webhook Secret from ENV:", process.env.NEXT_CLERK_WEBHOOK_SECRET);

    // Extract Svix headers safely
    const heads = {
      "svix-id": headersList.get("svix-id") || "",
      "svix-timestamp": headersList.get("svix-timestamp") || "",
      "svix-signature": headersList.get("svix-signature") || "",
    };

    console.log("🔍 Extracted Headers:", heads);

    // Validate headers exist before processing
    if (!heads["svix-id"] || !heads["svix-signature"] || !heads["svix-timestamp"]) {
      console.error("❌ Missing required Svix headers:", heads);
      return NextResponse.json({ message: "Missing required Svix headers" }, { status: 400 });
    }

    // Ensure Webhook Secret is available
    const webhookSecret = process.env.NEXT_CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ Webhook secret is missing in environment variables!");
      return NextResponse.json({ message: "Server misconfiguration" }, { status: 500 });
    }

    const payload = await request.json();
    console.log("🔍 Received Webhook Payload:", JSON.stringify(payload, null, 2));

    // Verify webhook signature using Svix
    const wh = new Webhook(webhookSecret);
    let event: Event | null = null;

    try {
      event = wh.verify(
        JSON.stringify(payload),
        heads as IncomingHttpHeaders & WebhookRequiredHeaders
      ) as Event;
    } catch (err) {
      console.error("❌ Webhook verification failed:", err);
      return NextResponse.json({ message: "Invalid webhook signature" }, { status: 400 });
    }

    console.log("✅ Webhook Verified:", event);

    const eventType: EventType = event?.type!;

    // Handle different event types
    switch (eventType) {
      case "organization.created":
        const { id, name, slug, logo_url, image_url, created_by } = event?.data ?? {};
        console.log("🔍 Logging event type:", eventType);
        try {
          // @ts-ignore
          await createCommunity(id, name, slug, logo_url || image_url, "org bio", created_by);
          return NextResponse.json({ message: "Organization created" }, { status: 201 });
        } catch (err) {
          console.error("❌ Error creating community:", err);
          return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }

      case "organizationMembership.created":
        const { organization, public_user_data } = event?.data;
        try {
          console.log("🔍 Membership Created Event Data:", event?.data);
          // @ts-ignore
          await addMemberToCommunity(organization.id, public_user_data.user_id);
          return NextResponse.json({ message: "Member added" }, { status: 201 });
        } catch (err) {
          console.error("❌ Error adding member:", err);
          return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }

      case "organizationMembership.deleted":
        const { organization: org, public_user_data: user } = event?.data;
        try {
          console.log("🔍 Membership Deleted Event Data:", event?.data);
          // @ts-ignore
          await removeUserFromCommunity(user.user_id, org.id);
          return NextResponse.json({ message: "Member removed" }, { status: 201 });
        } catch (err) {
          console.error("❌ Error removing member:", err);
          return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }

      case "organization.updated":
        const { id: orgId, name: orgName, slug: orgSlug, logo_url: orgLogo } = event?.data;
        try {
          console.log("🔍 Organization Updated Event Data:", event?.data);
          // @ts-ignore
          await updateCommunityInfo(orgId, orgName, orgSlug, orgLogo);
          return NextResponse.json({ message: "Organization updated" }, { status: 201 });
        } catch (err) {
          console.error("❌ Error updating organization:", err);
          return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }

      case "organization.deleted":
        const { id: deletedOrgId } = event?.data;
        try {
          console.log("🔍 Organization Deleted Event Data:", event?.data);
          // @ts-ignore
          await deleteCommunity(deletedOrgId);
          return NextResponse.json({ message: "Organization deleted" }, { status: 201 });
        } catch (err) {
          console.error("❌ Error deleting organization:", err);
          return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }

      default:
        console.warn("⚠️ Unhandled Event Type:", eventType);
        return NextResponse.json({ message: "Event type not handled" }, { status: 400 });
    }
  } catch (error) {
    console.error("❌ Unexpected Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
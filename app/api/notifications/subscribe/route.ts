import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { subscription } = await request.json();
    
    // Save the subscription to the database
    const subscriptionResponse = await prisma.subscription.create({
      data: {
        subscription: JSON.stringify(subscription),
        // userId: "681ff84b10b22260813d0a80" // For now, we're not associating with specific users
      }
    });

    console.log("Subscription saved:", subscriptionResponse); 

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

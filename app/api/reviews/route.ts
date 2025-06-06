import prisma from "@/lib/prisma";
import { IReview } from "@/types/reviews";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import webpush from "web-push";

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  privateKey: process.env.VAPID_PRIVATE_KEY || "",
};

webpush.setVapidDetails(
  "mailto:cristianbula5656@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(request: Request) {
  try {
    const body: Omit<IReview, "userId"> = await request.json();

    // Validar token y obtener userId desde el token
    const decoded = await validateToken();
    const userId = decoded.userId;

    if (!body.dateId || !body.rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingReview = await prisma.reviews.findFirst({
      where: {
        dateId: body.dateId,
        userId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Review already exists" },
        { status: 400 }
      );
    }

    const data = await prisma.reviews.create({
      data: {
        rating: body.rating,
        comment: body.comment,
        dateId: body.dateId,
        userId,
      },
    });

    const user = await prisma?.users?.findUnique({
      where: {
        id: userId,
      },
    });

    const date = await prisma?.dates?.findUnique({
      where: {
        id: body.dateId,
      },
    });

    const subscriptions = await prisma.subscription.findMany();

    for (const sub of subscriptions) {
      try {
        const response = await webpush.sendNotification(
          JSON.parse(sub.subscription),
          JSON.stringify({
            title: "Se agregó una reseña 👀!",
            body: `${user?.name || "Alguien"} le dio ${
              body.rating
            } estrellas a la cita ${
              date?.description || ""
            }, entra a la web para verla`,
          })
        );
        console.log(response);
      } catch (error) {
        console.error("Error sending notification to subscription:", error);
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allReviews = await prisma.reviews.findMany();

    return NextResponse.json(allReviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return NextResponse.json(
      { error: "Error fetching all reviews" },
      { status: 500 }
    );
  }
}

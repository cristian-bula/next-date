import { validateToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import webpush from "web-push";

// Initialize web-push with your VAPID keys
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
    const body = await request.json();
    await validateToken();

    if (!body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const newDate = await prisma.dates.create({
      data: {
        date: body.date,
        description: body.description,
        dressCode: body?.dressCode || "No aplica",
        photos: body.photos,
      },
    });

    const subscriptions = await prisma.subscription.findMany();

    for (const sub of subscriptions) {
      try {
        const response = await webpush.sendNotification(
          JSON.parse(sub.subscription),
          JSON.stringify({
            title: "Se agregó una nueva fecha 🥰!",
            body: `Se ha agregado una nueva fecha: ${body.description} para el ${body.date} por ${body.user?.name || "Alguien"} 🎉`,
          })
        );
        console.log(response);
      } catch (error) {
        console.error("Error sending notification to subscription:", error);
      }
    }

    await prisma.dates_backups.create({
      data: {
        dateId: newDate.id,
        date: body.date,
        description: body.description,
        dressCode: body?.dressCode || "No aplica",
        photos: body.photos,
      },
    });

    return NextResponse.json(newDate);
  } catch (error) {
    console.error("Error creating date:", error);
    return NextResponse.json(
      { error: "Failed to create date" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // await validateToken();
    const allDates = await prisma.dates.findMany({
      orderBy: { date: "asc" },
      include: { reviews: { include: { user: true } } },
    });

    return NextResponse.json(allDates);
  } catch (error) {
    console.error("Error fetching all dates:", error);
    return NextResponse.json(
      { error: "Error fetching all dates" },
      { status: 500 }
    );
  }
}

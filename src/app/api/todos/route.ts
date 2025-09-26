import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import webpush from "web-push";
import { ITodo } from "@/types/todo";

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
    const body: Omit<ITodo, "userId"> = await request.json();

    // Validar token y obtener userId desde el token
    const decoded = await validateToken();
    const userId = decoded.userId;

    if (!body.text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = await prisma.todo.create({
      data: {
        text: body.text,
        userId,
      },
    });

    const subscriptions = await prisma.subscription.findMany();

    for (const sub of subscriptions) {
      try {
        const response = await webpush.sendNotification(
          JSON.parse(sub.subscription),
          JSON.stringify({
            title: "Se agregó una tarea 👀!",
            body: `Alguien agregó una tarea, entra a la web para verla`,
          })
        );
      } catch (error) {
        console.error("Error sending notification to subscription:", error);
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to create todo" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allTodos = await prisma.todo.findMany();
    return NextResponse.json(allTodos);
  } catch (error) {
    console.error("Error fetching all todos:", error);
    return NextResponse.json(
      { error: "Error fetching all todos" },
      { status: 500 }
    );
  }
}

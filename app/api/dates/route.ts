import { validateToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
        photos: body.photos,
      },
    });

    await prisma.dates_backups.create({
      data: {
        dateId: newDate.id,
        date: body.date,
        description: body.description,
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

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const upcomingDate = await prisma.dates.findFirst({
      where: {
        date: { gt: new Date() },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(upcomingDate);
  } catch (error) {
    console.error("Error fetching upcoming date:", error);
    return NextResponse.json(
      { error: "Error fetching upcoming date" },
      { status: 500 }
    );
  }
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pastDates = await prisma.dates.findMany({
      where: {
        date: { lt: new Date() },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(pastDates);
  } catch (error) {
    console.error("Error fetching past dates:", error);
    return NextResponse.json(
      { error: "Error fetching past dates" },
      { status: 500 }
    );
  }
}

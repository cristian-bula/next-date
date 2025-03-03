import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Esta sería la ruta para obtener la próxima cita
export async function GET() {
  try {
    // Aquí conectarías con tu base de datos
    // Por ejemplo con Prisma:
    const upcomingDate = await prisma.dates.findFirst({
      where: {
        date: { gt: new Date() },
      },
      orderBy: { date: "asc" },
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

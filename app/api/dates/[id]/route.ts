import { validateToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DateEvent } from "@/types/date";
import { NextResponse } from "next/server";

// Para actualizar una cita
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: Partial<DateEvent> = await request.json();

    await validateToken();
    // Actualizar en base de datos
    const updatedDate = await prisma.dates.update({
      where: { id },
      data: {
        ...(body.date && { date: new Date(body.date) }),
        ...(body.description && { description: body.description }),
        ...(body.dressCode && { dressCode: body.dressCode }),
        ...(body.photos && { photos: body.photos }),
      },
    });

    await prisma.dates_backups.updateMany({
      where: {
        dateId: updatedDate.id,
      },
      data: {
        ...(body.date && { date: new Date(body.date) }),
        ...(body.description && { description: body.description }),
        ...(body.dressCode && { dressCode: body.dressCode }),
        ...(body.photos && { photos: body.photos }),
      },
    });

    return NextResponse.json(updatedDate);
  } catch (error) {
    console.error(`Error updating date ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update date" },
      { status: 500 }
    );
  }
}

// Para eliminar una cita
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await validateToken();

    // Eliminar de base de datos
    await prisma.dates.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting date ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete date" },
      { status: 500 }
    );
  }
}

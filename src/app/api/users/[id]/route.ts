import { validateToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { IUser } from "@/types/user";
import { NextResponse } from "next/server";

// Para actualizar un user
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const body: Partial<IUser> = await request.json();
    await validateToken();

    const data = await prisma.users.update({
      where: { id },
      data: {
        ...(body.name && { photos: body.name }),
        ...(body.email && { email: body.email }),
        ...(body.password && { password: body.password }),
        ...(body.role && { role: body.role }),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Para eliminar una user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    await validateToken();

    await prisma.users.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

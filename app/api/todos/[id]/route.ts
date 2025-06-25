import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import { ITodo } from "@/types/todo";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: Partial<ITodo> = await request.json();

    const user = await validateToken();

    const data = await prisma.todo.update({
      where: { id },
      data: {
        ...(body.text && { text: body.text }),
        completed: body.completed,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Error updating todos ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message ?? "Failed to update todos" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await validateToken();

    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    if (existingTodo.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting todos ${params.id}:`, error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete todos" },
      { status: 500 }
    );
  }
}

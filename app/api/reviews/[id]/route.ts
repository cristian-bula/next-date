import prisma from "@/lib/prisma";
import { IReview } from "@/types/reviews";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: Partial<IReview> = await request.json();

    const user = await validateToken(request);

    const existingReview = await prisma.reviews.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (existingReview.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await prisma.reviews.update({
      where: { id },
      data: {
        ...(body.comment && { comment: body.comment }),
        ...(body.rating && { rating: body.rating }),
        ...(body.dateId && { dateId: body.dateId }),
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Error updating reviews ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message ?? "Failed to update reviews" },
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

    const user = await validateToken(request);

    const existingReview = await prisma.reviews.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (existingReview.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.reviews.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting reviews ${params.id}:`, error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to delete reviews" },
      { status: 500 }
    );
  }
}

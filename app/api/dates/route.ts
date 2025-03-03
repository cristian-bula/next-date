import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos recibidos
    if (!body.date || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Guardar en base de datos
    // const newDate = await prisma.dates.create({
    //   data: {
    //     date: new Date(body.date),
    //     description: body.description,
    //     photo: body.photo || "/placeholder.svg?height=400&width=300",
    //     userId: session.user.id
    //   }
    // });

    // Simulamos respuesta exitosa
    const newDate = {
      id: `date-${Date.now()}`,
      ...body,
      date: new Date(body.date),
    };

    return NextResponse.json(newDate);
  } catch (error) {
    console.error("Error creating date:", error);
    return NextResponse.json(
      { error: "Failed to create date" },
      { status: 500 }
    );
  }
}

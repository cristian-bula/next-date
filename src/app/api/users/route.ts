import prisma from "@/lib/prisma";
import { encryptPassword } from "@/lib/utils";
import { IUser } from "@/types/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: IUser = await request.json();

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { email: body.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "El correo ya está en uso" },
        { status: 409 }
      );
    }

    const data = await prisma.users.create({
      data: {
        email: body.email,
        name: body.name,
        password: encryptPassword(body.password),
        role: "user",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     const allUser = await prisma.users.findMany();

//     return NextResponse.json(allUser);
//   } catch (error) {
//     console.error("Error fetching all users:", error);
//     return NextResponse.json(
//       { error: "Error fetching all users" },
//       { status: 500 }
//     );
//   }
// }

import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

import { cookies } from "next/headers";

// export async function validateToken() {
//   const token = cookies().get("token")?.value;

//   if (!token) {
//     throw new Error("Unauthorized: Missing token");
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

//     // Verificar whitelist en DB
//     const validToken = await prisma.tokenWhiteList.findFirst({
//       where: {
//         token,
//         userId: decoded.userId,
//         expiresAt: {
//           gt: new Date(),
//         },
//       },
//     });

//     if (!validToken) {
//       throw new Error("Unauthorized: Invalid token");
//     }

//     return decoded;
//   } catch (err) {
//     throw new Error("Unauthorized: Invalid or expired token");
//   }
// }

export async function validateToken() {
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized: Missing token");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    // Verificar whitelist en DB
    const validToken = await prisma.tokenWhiteList.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!validToken) {
      throw new Error("Unauthorized: Invalid token");
    }

    const user = await prisma.users.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      throw new Error("Unauthorized: Invalid token");
    }

    if (user.role !== "admin") {
      throw new Error("Unauthorized: Invalid token");
    }

    return decoded;
  } catch (err) {
    throw new Error("Unauthorized: Invalid or expired token");
  }
}

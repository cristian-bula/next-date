import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function validateToken(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Missing token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Verificar que el token existe en la whitelist
    const validToken = await prisma.tokenWhiteList.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date(), // no expirado
        },
      },
    });

    if (!validToken) {
      throw new Error("Unauthorized: Invalid token");
    }

    return decoded;
  } catch (err) {
    throw new Error("Unauthorized: Invalid or expired token");
  }
}

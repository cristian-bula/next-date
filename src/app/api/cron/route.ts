import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import webpush from "web-push";

const messages = [
  "Eres lo más hermoso que tengo en mi vida ❤️",
  "Nunca olvides lo fuerte y valiente que eres ✨",
  "Cada día me siento más afortunado de tenerte 💖",
  "Eres increíble y estoy orgulloso de ti 💎",
  "Eres única, hermosa y especial 🌹",
  "Gracias por existir en mi vida 💫",
  "Sigue luchando, sé que puedes con todo 🌟",
  "Te amo con todo mi corazón 💖",
  "Eres fuerte, valiente y muy capaz 🫶🏻",
  "Recuerda lo increíble que eres 💎",
  "Soy feliz porque estás a mi lado 💞",
  "Te amo más cada día 🌹",
  "Siempre estás en mis oraciones 🙏",
  "Que Dios te bendiga grandemente en este dia 🙏",
  "Eres una mujer increíble 🌹",
  "Deseo que sigas siendo tu ❤️",
  "No te imaginas lo mucho que me gustas 🌚",
  "Tu carita es hermosa y tus ojos tan hermosos 💖",
  "No estás sola Andreíta <3",
  "Dios tiene un plan maravilloso para ti 🙏",
  "Pon tus ojos en Dios y él te guiará 🙏",
  "Amo con todo mi corazón tu sonrisa <3",
  "Lo estás haciendo maravillosamente 💖",
  "Te quiero cada día más 📅❤️",
  "Amo lo que estamos construyendo juntos",
  "Te extraño mucho, no se cuando te llegue esto, pero estoy seguro que te extraño ❤️",
  "Quiero verte (ojalá lo esté haciendo ahora mismo) 🫶🏻",
];

function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

export async function GET(req: Request) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ ok: false });
  }

  const randomMessage = getRandomMessage();
  let sent = 0;

  try {
    const subscriptions = await prisma.subscription.findMany();

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          JSON.parse(sub.subscription),
          JSON.stringify({
            title: "Pa' usted mi vida 💌",
            body: randomMessage,
          })
        );
        sent++;
      } catch (error) {
        console.error("Error sending notification to subscription:", error);
      }
    }
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
  }

  return NextResponse.json({ ok: true, sent: randomMessage, number: sent });
}

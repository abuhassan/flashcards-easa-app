import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const pendingFlashcards = await prisma.flashcard.findMany({
    where: { approved: false },
  });

  return NextResponse.json(pendingFlashcards);
}

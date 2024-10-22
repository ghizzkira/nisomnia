import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tmdbId: string }> }
) {
  const tmdbId = (await params).tmdbId


  const data = await db.query.movies.findFirst({
    where: (movie, { eq }) => eq(movie.tmdbId, tmdbId),
  })

  return NextResponse.json(data, { status: 200 })
}

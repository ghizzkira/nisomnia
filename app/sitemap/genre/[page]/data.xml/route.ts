/* eslint-disable @typescript-eslint/restrict-template-expressions */

import type { NextRequest } from "next/server"

import env from "@/env"
import { api } from "@/lib/trpc/server"

function generateSiteMap(
  genres:
    | {
        slug: string
        updatedAt: Date | null
      }[]
    | null,
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${
       genres
         ?.map((genre) => {
           return `
       <url>
           <loc>https://${`${env.NEXT_PUBLIC_DOMAIN}/genre/${genre.slug}`}</loc>
           <lastmod>${
             new Date(genre.updatedAt!).toISOString().split("T")[0]
           }</lastmod>
       </url>
     `
         })
         .join("") ?? []
     }
   </urlset>
 `
}

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ page: string }> },
) {
  const params = await props.params
  const page = parseInt(params.page)

  const genres = await api.genre.sitemap({
    page: page,
    perPage: 1000,
  })

  const sitemap = generateSiteMap(genres!)

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Cache-control": "public, s-maxage=86400, stale-while-revalidate",
      "content-type": "application/xml",
    },
  })
}

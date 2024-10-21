import { NextResponse, type NextRequest } from "next/server"

import env from "@/env.mjs"
import { db } from "@/lib/db"
import { medias } from "@/lib/db/schema/media"
import { uploadImageToR2 } from "@/lib/r2"
import { cuid } from "@/lib/utils"
import { generateUniqueMediaName } from "@/lib/utils/slug"
import { mediaType, type MediaType } from "@/lib/validation/media"

export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData()

    const files = formData.getAll("file") as Blob[]
    const formTypes = formData.getAll("type") as MediaType[]

    if (files.length === 0) {
      return NextResponse.json("At least one file is required.", {
        status: 400,
      })
    }

    const defaultFileType = "image/webp"
    const defaultFileExtension = "webp"

    const uploadedFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const buffer = Buffer.from(await file.arrayBuffer())

      //@ts-ignore
      const [fileName, _fileType] = file?.name.split(".") || []
      const uniqueFileName = await generateUniqueMediaName(
        fileName,
        defaultFileExtension,
      )

      const mediaTypes = formTypes[i] as MediaType
      const type = mediaType.parse(mediaTypes)

      await uploadImageToR2({
        file: buffer,
        fileName: type + "/" + uniqueFileName,
        contentType: defaultFileType,
      })

      const data = await db.insert(medias).values({
        id: cuid(),
        name: uniqueFileName,
        url: `https://${env.R2_DOMAIN}/${type}/${uniqueFileName}`,
        type: type,
        imageType: defaultFileType,
        authorId: "1QVv0d2sgonwKWXafbVrOH4rK4sElZmVbZUOWTV2"
      }).returning()

      uploadedFiles.push(data)
    }

    return NextResponse.json(uploadedFiles, { status: 200 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}

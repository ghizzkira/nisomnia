"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import DashboardAddTopics from "@/components/dashboard/dashboard-add-topics"
import Image from "@/components/image"
import DeleteMediaButton from "@/components/media/delete-media-button"
import SelectMediaDialog from "@/components/media/select-media-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast/use-toast"
import { useI18n, useScopedI18n } from "@/lib/locales/client"
import { api } from "@/lib/trpc/react"
import type { FeedType } from "@/lib/validation/feed"
import type { LanguageType } from "@/lib/validation/language"

interface FormValues {
  title: string
  language: LanguageType
  link?: string
  type: FeedType
  owner?: string
  topics: string[]
}

export default function CreateFeedForm() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [selectedFeaturedImage, setSelectedFeaturedImage] =
    React.useState<string>("")
  const [topics, setTopics] = React.useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = React.useState<
    { id: string; title: string }[] | []
  >([])

  const t = useI18n()
  const ts = useScopedI18n("feed")

  const router = useRouter()

  const { mutate: createFeed } = api.feed.create.useMutation({
    onSuccess: () => {
      form.reset()
      router.push("/dashboard/feed")
      toast({ variant: "success", description: ts("create_success") })
    },
    onError: (error) => {
      setLoading(false)
      const errorData = error?.data?.zodError?.fieldErrors

      if (errorData) {
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            errorData[field]?.forEach((errorMessage) => {
              toast({
                variant: "danger",
                description: errorMessage,
              })
            })
          }
        }
      } else if (error?.message) {
        toast({
          variant: "danger",
          description: error.message,
        })
      } else {
        toast({
          variant: "danger",
          description: ts("update_failed"),
        })
      }
    },
  })

  const form = useForm<FormValues>()

  const valueLanguage = form.watch("language")

  const onSubmit = (values: FormValues) => {
    const mergedValues = {
      ...values,
      featuredImage: selectedFeaturedImage,
    }
    setLoading(true)
    createFeed(selectedFeaturedImage ? mergedValues : values)
    setLoading(false)
  }

  const handleUpdateMedia = (data: { url: React.SetStateAction<string> }) => {
    setSelectedFeaturedImage(data.url)
    setOpenDialog(false)
    toast({ variant: "success", description: t("featured_image_selected") })
  }

  const handleDeleteFeaturedImage = () => {
    setSelectedFeaturedImage("")
    toast({
      variant: "success",
      description: t("featured_image_deleted"),
    })
  }

  return (
    <div className="mx-0 space-y-4 lg:mx-8 lg:p-5">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <h1 className="pb-2 lg:pb-5">{ts("add")}</h1>
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{
                  required: t("title_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("title")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("title_placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                rules={{
                  required: t("language_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("language")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("language_placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="id">Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {valueLanguage && (
                <div className="my-2">
                  <DashboardAddTopics
                    mode="edit"
                    locale={valueLanguage}
                    fieldName="topics"
                    control={form.control}
                    topics={topics}
                    addTopics={setTopics}
                    selectedTopics={selectedTopics}
                    addSelectedTopics={setSelectedTopics}
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="type"
                rules={{
                  required: t("type_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("type")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("type_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="tiktok">Tiktok</SelectItem>
                        <SelectItem value="x">X</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("link")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("link_placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("owner")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("owner_placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full lg:w-6/12 lg:space-y-4">
              <FormLabel>{t("featured_image")}</FormLabel>
              {selectedFeaturedImage ? (
                <div className="relative overflow-hidden rounded-[18px]">
                  <DeleteMediaButton
                    description="Featured Image"
                    onDelete={() => handleDeleteFeaturedImage()}
                  />
                  <SelectMediaDialog
                    handleSelectUpdateMedia={handleUpdateMedia}
                    open={openDialog}
                    setOpen={setOpenDialog}
                    category="feed"
                  >
                    <div className="relative aspect-video h-[150px] w-full cursor-pointer rounded-sm border-2 border-muted/30 lg:h-full lg:max-h-[400px]">
                      <Image
                        src={selectedFeaturedImage}
                        className="rounded-lg object-cover"
                        fill
                        alt={t("featured_image")}
                        onClick={() => setOpenDialog(true)}
                        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 33vw"
                      />
                    </div>
                  </SelectMediaDialog>
                </div>
              ) : (
                <SelectMediaDialog
                  handleSelectUpdateMedia={handleUpdateMedia}
                  open={openDialog}
                  setOpen={setOpenDialog}
                  category="feed"
                >
                  <div
                    onClick={() => setOpenDialog(true)}
                    className="relative mr-auto flex aspect-video h-[150px] w-full cursor-pointer items-center justify-center rounded-lg border-border bg-muted text-foreground lg:h-full lg:max-h-[250px]"
                  >
                    <p>{t("featured_image_placeholder")}</p>
                  </div>
                </SelectMediaDialog>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Button
              aria-label={t("submit")}
              type="submit"
              onClick={() => {
                form.handleSubmit(onSubmit)()
              }}
              loading={loading}
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

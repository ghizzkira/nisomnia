import * as React from "react"
import NextLink from "next/link"

import Image from "@/components/image"
import { Icon } from "@/components/ui/icon"
import type { SelectUser } from "@/lib/db/schema"

type UserDataProps = Pick<SelectUser, "id" | "name" | "username" | "image">

interface UserCardSearchProps {
  user: UserDataProps
  isDashboard?: boolean
  onClick?: () => void
}

const UserCardSearch: React.FC<UserCardSearchProps> = (props) => {
  const { user, isDashboard, onClick } = props

  const { id, name, username, image } = user

  return (
    <NextLink
      aria-label={username!}
      href={isDashboard ? `/dashboard/user/edit/${id}` : `/user/${username}`}
      className="mb-2 w-full"
      onClick={onClick}
    >
      <div className="flex flex-row rounded-xl p-3 hover:bg-accent">
        <div className="relative aspect-[1/1] h-[50px] w-auto max-w-[unset] overflow-hidden">
          {image ? (
            <Image
              src={image}
              className="rounded-xl object-cover"
              alt={name!}
            />
          ) : (
            <Icon.User />
          )}
        </div>
        <div className="ml-2 w-3/4">
          <h3 className="mt-3 text-sm font-medium lg:text-lg">{name}</h3>
        </div>
      </div>
    </NextLink>
  )
}

export default UserCardSearch

import dynamicFn from "next/dynamic"

const DashboardAdContent = dynamicFn(async () => {
  const DashboardAdContent = await import("./content")
  return DashboardAdContent
})

export const metadata = {
  title: "Ad Dashboard",
}

export default function DashboardAdPage() {
  return <DashboardAdContent />
}

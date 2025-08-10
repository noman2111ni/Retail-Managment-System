import { LoginForm } from "@/components/layout/LoginForm"
import { GalleryVerticalEnd } from "lucide-react"


export default function Login() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-8">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  )
}

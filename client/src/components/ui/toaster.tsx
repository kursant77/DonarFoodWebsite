import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, ShoppingCart, PartyPopper, Sparkles } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  const getSuccessIcon = (title?: string) => {
    if (title?.toLowerCase().includes("savat")) {
      return <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
    }
    if (title?.toLowerCase().includes("zakaz") || title?.toLowerCase().includes("buyurtma")) {
      return <PartyPopper className="h-5 w-5 text-green-600 dark:text-green-400" />
    }
    return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props} variant={variant} duration={3000}>
            <div className="flex items-start gap-3 w-full">
              {/* Success Icon */}
              {variant === "success" && (
                <div className="flex-shrink-0 mt-0.5">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-1.5 animate-in zoom-in-95 duration-300">
                    {getSuccessIcon(title as string)}
                  </div>
                </div>
              )}
              
              <div className="grid gap-1 flex-1">
                {title && (
                  <ToastTitle className="flex items-center gap-2">
                    {variant === "success" && (
                      <Sparkles className="h-4 w-4 text-green-500 animate-pulse" />
                    )}
                    <span>{title}</span>
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

import { useToast } from "@/components/ui/use-toast";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";

export function CustomToast() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant} className="border bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <ToastTitle className="text-black dark:text-white font-medium">
            {toast.title}
          </ToastTitle>
          <ToastDescription className="text-gray-700 dark:text-gray-300 text-sm">
            {toast.description}
          </ToastDescription>
        </Toast>
      ))}
    </div>
  );
}

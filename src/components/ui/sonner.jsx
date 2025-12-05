import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        error: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        warning: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        info: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-t-4 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:p-4",
          description: "group-[.toast]:text-gray-600 group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-gray-900 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:rounded-md",
          cancelButton:
            "group-[.toast]:bg-gray-200 group-[.toast]:text-gray-900 group-[.toast]:font-medium group-[.toast]:rounded-md",
          success:
            "group-[.toaster]:border-t-green-500 group-[.toaster]:bg-green-50",
          error:
            "group-[.toaster]:border-t-red-500 group-[.toaster]:bg-red-50",
          warning:
            "group-[.toaster]:border-t-orange-500 group-[.toaster]:bg-orange-50",
          info:
            "group-[.toaster]:border-t-blue-500 group-[.toaster]:bg-blue-50",
        },
      }}
      {...props}
    />
  );
}

export default { Toaster }

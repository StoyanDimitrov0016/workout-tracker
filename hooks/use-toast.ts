import { toast, type ToastOptions } from "@backpackapp-io/react-native-toast";

export function useToast() {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, options);
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    toast(message, options);
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
}

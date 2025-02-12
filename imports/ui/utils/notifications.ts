import { showNotification } from "@mantine/notifications";

export const handleMeteorError = (error: string): void => {
  showNotification({
    title: "Error!",
    message: error,
    color: "red",
  });
};

export const handleMeteorSuccess = (message: string): void => {
  showNotification({
    title: "Success!",
    message,
  });
};

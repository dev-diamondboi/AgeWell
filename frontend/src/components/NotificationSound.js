import React, { useEffect } from "react";

const NotificationSound = () => {
  useEffect(() => {
    const audio = new Audio("/notification.mp3");

    const playSound = () => {
      audio.play();
    };

    document.addEventListener("newNotification", playSound);

    return () => {
      document.removeEventListener("newNotification", playSound);
    };
  }, []);

  return null;
};

export default NotificationSound;

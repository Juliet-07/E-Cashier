import React, { useState } from "react";
import { useIdleTimer } from "react-idle-timer";

export const useIdle = ({ onIdle, idleTime = 1 }) => {
  const [isIdle, setIsIdle] = useState();
  const handleOnIdle = (event) => {
    setIsIdle(true);
    console.log("user is inactive", event);
    console.log("Last Active", getLastActiveTime());
    onIdle();
  };
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 600 * idleTime,
    onIdle: handleOnIdle,
    debounce: 5000,
  });
  return {
    getRemainingTime,
    getLastActiveTime,
    isIdle,
  };
};

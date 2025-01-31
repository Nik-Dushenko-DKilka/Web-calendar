"use client";
import { useState } from "react";

import Header from "@/components/Header/Header";
import CalendarBoard from "@/components/CalendarBoard/CalendarBoard";

const WebCalendar = () => {
  const [isDayView, setIsDayView] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  return (
    <>
      <Header
        currentDate={currentDate}
        isDayView={isDayView}
        setCurrentDate={setCurrentDate}
        setIsDayView={setIsDayView}
      />
      <CalendarBoard
        isDayView={isDayView}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
    </>
  );
};

export default WebCalendar;

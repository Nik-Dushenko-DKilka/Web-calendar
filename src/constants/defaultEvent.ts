import { NewEvent } from "@/types/NewEvent";
import {
  addDays,
  addHours,
  format,
  fromUnixTime,
  getUnixTime,
  startOfDay,
} from "date-fns";

const startOfTime = getUnixTime(addHours(startOfDay(new Date()), 5));

export const defaultEvent: NewEvent = {
  title: "",
  date: format(new Date(), "yyyy-MM-dd"),
  timestamp: getUnixTime(addDays(new Date(), 1)),
  time: [startOfTime, startOfTime],
  allDay: false,
  calendar: { id: "0", name: "default", color: "red", isVisible: true },
  description: "",
};

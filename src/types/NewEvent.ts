import { Calendar } from "./Calendar";

export type NewEvent = {
  title: string;
  description: string;
  timestamp: number;
  allDay: boolean;
  calendar: Calendar;
  date: string;
  time: number[];
};

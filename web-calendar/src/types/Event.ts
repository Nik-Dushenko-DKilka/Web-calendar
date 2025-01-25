import { Calendar } from "./Calendar";

type Event = {
  id: string;
  title: string;
  timestamp: number;
  time: number[];
  allDay: boolean;
  repeat: string;
  calendar: Calendar;
  description: string;
  repeatID?: string | number;
};

export default Event;

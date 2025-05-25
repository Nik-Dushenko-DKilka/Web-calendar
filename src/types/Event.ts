import { Calendar } from "./Calendar";

type Event = {
  id: string;
  title: string;
  timestamp: number;
  time: number[];
  allDay: boolean;
  calendar: Calendar;
  description: string;
  repeatID?: string | number;
  leftOffset: number;
  width: number;
  collisions: number;
  index: number;
};

export default Event;

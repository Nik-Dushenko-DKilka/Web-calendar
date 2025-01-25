import { format, setHours, addMinutes } from "date-fns";

const hoursForDay: number = 19;
const hoursFromStart: number = 6;

/**
 * List of hours is an array that return a list with hours.Example: use for a select menu for select an hour for event
 * @return {array} with hours,each element is a string
 */
export const listOfHours: string[] = Array.from(
  { length: hoursForDay },
  (_, i) => {
    const date = setHours(new Date(), i + hoursFromStart);

    return format(date, "h a");
  }
);

/**
 * List of minutes is an array that return a wist with minutes and step each 15 minuter(5:00,5:15...)
 * @return {array} with minutes,each element is a string
 */
export const listOfMinutes = Array.from(
  { length: 4 * 24 + 1 }, // 24 hours + 1 hour (for 25 hours), 15-minute intervals
  (_, i) =>
    format(addMinutes(new Date().setHours(5, 0, 0, 0), i * 15), "h:mm a")
);

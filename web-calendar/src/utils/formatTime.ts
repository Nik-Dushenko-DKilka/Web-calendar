import Event from "@/types/Event";
import { format, fromUnixTime } from "date-fns";

/**
 * formatTime using for parse date and time from event to string
 * @param time it's a time from event for parse it as a string
 *
 * @return {string} this string return formatted time
 */
const formatTime = (time: Event): string => {
  const formattedDate = format(fromUnixTime(time.timestamp), "PPPP");
  const formattedStartTime = format(fromUnixTime(time.time[0]), "p");
  const formattedEndTime = format(fromUnixTime(time.time[1]), "p");

  return `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;
};

export default formatTime;

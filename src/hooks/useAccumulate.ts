import Event from "@/types/Event";
import { ListOfDailyEvents } from "@/types/ListOfDailyEvents";
import { addDays, differenceInDays, format } from "date-fns";

const useAccumulate = () => {
  const newEvent = (event: Event, currentDate: Date) => {
    const daysDifference = differenceInDays(
      currentDate,
      new Date(event.timestamp * 1000)
    );
    const updatedTimestamp =
      addDays(new Date(event.timestamp * 1000), daysDifference).getTime() /
      1000;
    return {
      id: event.id,
      timestamp: updatedTimestamp,
      startTime: event.time[0] + daysDifference * 86400,
      endTime: event.time[1] + daysDifference * 86400,
      collisions: 0,
      repeatID: `${event.id}_${updatedTimestamp}`,
    };
  };

  const accumulateEvents = (
    currentDate: Date,
    lastDateOfWeek: Date,
    dailyEvents: ListOfDailyEvents,
    event: Event
  ) => {
    const eventDateKey = format(currentDate, "P");
    if (!dailyEvents[eventDateKey]) {
      dailyEvents[eventDateKey] = [];
    }
    dailyEvents[eventDateKey].push(newEvent(event, currentDate));
  };

  const accumulateCollisions = (events: Event[]) => {
    const updatedEvents = events.map((event, i) => {
      for (let j = 1; j < events.length - 1; j++) {
        return console.log(i, j);
      }
    });

    return updatedEvents;
  };

  return { accumulateEvents, accumulateCollisions };
};

export default useAccumulate;

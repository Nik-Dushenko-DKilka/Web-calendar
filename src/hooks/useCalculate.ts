import { RepeatEvents } from "@/enums/RepeatEvents";
import Event from "@/types/Event";
import { DailyEvent, ListOfDailyEvents } from "@/types/ListOfDailyEvents";
import {
  areIntervalsOverlapping,
  differenceInMinutes,
  endOfDay,
  endOfWeek,
  fromUnixTime,
  getISOWeek,
  startOfWeek,
} from "date-fns";
import useAccumulate from "./useAccumulate";

const useCalculate = () => {
  const { accumulateCollisions, accumulateEvents } = useAccumulate();

  const calculateEventsForWeek = (events: Event[], currentDate: Date) => {
    // const firstDateOfWeek = startOfWeek(new Date(currentDate));
    // const lastDateOfWeek = endOfWeek(new Date(currentDate));
    // const eventsThisWeek = events.filter((event: Event) => {
    //   const eventDate = fromUnixTime(event.timestamp);
    //   return eventDate >= firstDateOfWeek && eventDate <= lastDateOfWeek;
    // });
    // const eventsByWeek = new Map<number, ListOfDailyEvents>();
    // eventsThisWeek.forEach((event: Event) => {
    //   const eventStartDate = fromUnixTime(event.timestamp);
    //   const weekNumber = getISOWeek(eventStartDate);
    //   if (!eventsByWeek.has(weekNumber)) {
    //     eventsByWeek.set(weekNumber, {});
    //   }
    //   const dailyEvents = eventsByWeek.get(weekNumber) ?? {};
    //   let currentDate = eventStartDate;
    //   accumulateEvents(currentDate, lastDateOfWeek, dailyEvents, event);
    //   eventsByWeek.set(weekNumber, dailyEvents);
    // });
    // const currentWeekNumber = getISOWeek(new Date(currentDate));
    // return { currentWeekNumber, eventsByWeek };
  };

  const calculateCollisions = (
    eventsByWeek: Map<number, ListOfDailyEvents>,
    currentWeekNumber: number
  ) => {
    const eventsForCurrentWeek = eventsByWeek.get(currentWeekNumber);
    const updatedEvents: ListOfDailyEvents = {};
    for (const date in eventsForCurrentWeek) {
      if (eventsForCurrentWeek.hasOwnProperty(date)) {
        const dailyEvents = eventsForCurrentWeek[date];

        accumulateCollisions(dailyEvents);
        calculateProperties(dailyEvents);

        updatedEvents[date] = dailyEvents;
      }
    }

    return updatedEvents;
  };

  const calculateProperties = (dailyEvents: DailyEvent[]) => {
    dailyEvents.forEach((event) => {
      const overlappingEvents = dailyEvents.filter((otherEvent) => {
        const firstEventStart = fromUnixTime(event.startTime);
        const firstEventEnd = fromUnixTime(event.endTime);
        const secondEventStart = fromUnixTime(otherEvent.startTime);
        const secondEventEnd = fromUnixTime(otherEvent.endTime);

        return areIntervalsOverlapping(
          { start: firstEventStart, end: firstEventEnd },
          { start: secondEventStart, end: secondEventEnd }
        );
      });

      overlappingEvents.sort((a, b) => {
        const durationA = a.endTime - a.startTime;
        const durationB = b.endTime - b.startTime;
        if (durationA !== durationB) {
          return durationB - durationA;
        }
        return a.id < b.id ? -1 : 1;
      });

      const positionIndex = overlappingEvents.findIndex(
        (overlap) => overlap.id === event.id
      );
      const widthPercentage = 100 / overlappingEvents.length;
      event.leftOffset = widthPercentage * positionIndex;
      event.width = widthPercentage;
    });
  };

  const calculateMinutes = (timestamp: number) => {
    const minutes: number = fromUnixTime(timestamp).getMinutes();
    const percentageMap: Record<number, string> = {
      15: "25%",
      30: "50%",
      45: "75%",
    };

    return percentageMap[minutes] || "0%";
  };

  const calculateHeightPercentage = (
    startTimestamp: number,
    endTimestamp: number,
    allDay: boolean
  ): string => {
    const startTime: Date = fromUnixTime(startTimestamp);
    const endTime: Date = fromUnixTime(endTimestamp);
    const totalMinutes: number = differenceInMinutes(endTime, startTime);
    const totalMinutesFromEndDay: number = differenceInMinutes(
      endOfDay(fromUnixTime(endTimestamp)),
      startTime
    );

    //15 is a each 15 minutes in an hour and 25 is a percentage for height(each 15 minutes is a 25%)
    const intervals: number = allDay
      ? Math.ceil(totalMinutesFromEndDay / 15)
      : Math.ceil(totalMinutes / 15);
    const heightPercentage = intervals * 25;

    //heightPercentage + 25 for move an event to the bottom
    return `${
      heightPercentage <= 25
        ? "fit-content"
        : allDay
        ? heightPercentage + 25
        : heightPercentage
    }%`;
  };

  const calculateWidth = (
    event: Event,
    listOfDailyEvents: ListOfDailyEvents,
    day?: string
  ) => {
    for (const date in listOfDailyEvents) {
      if (day === date) {
        for (const el of listOfDailyEvents[date]) {
          if (
            (el.repeat === RepeatEvents.DAILY &&
              el.repeatID === event.repeatID) ||
            el.timestamp === event.timestamp
          ) {
            return `${el.width}%`;
          }
        }
      }
    }

    return `100%`;
  };

  const calculateLeft = (
    event: Event,
    listOfDailyEvents: ListOfDailyEvents
  ) => {
    for (const date in listOfDailyEvents) {
      if (listOfDailyEvents.hasOwnProperty(date)) {
        const dailyEvents = listOfDailyEvents[date];
        for (const el of dailyEvents) {
          if (
            el.repeatID === event.repeatID ||
            (el.id === event.id && el.repeat !== RepeatEvents.DAILY)
          ) {
            return `${el.leftOffset}%`;
          }
        }
      }
    }
  };

  return {
    calculateEventsForWeek,
    calculateCollisions,
    calculateLeft,
    calculateMinutes,
    calculateHeightPercentage,
    calculateWidth,
  };
};

export default useCalculate;

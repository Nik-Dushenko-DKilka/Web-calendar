import { RepeatEvents } from "@/enums/RepeatEvents";
import Event from "@/types/Event";
import {
  areIntervalsOverlapping,
  differenceInMinutes,
  endOfDay,
  fromUnixTime,
} from "date-fns";

const useCalculate = () => {
  const calculateCollisions = (events: Event[]) => {
    const eventsCopy = events.map((event) => ({
      ...event,
      collisions: 0,
      index: 0,
    }));

    for (let i = 0; i < eventsCopy.length; i++) {
      for (let j = i + 1; j < eventsCopy.length; j++) {
        if (
          areIntervalsOverlapping(
            {
              start: fromUnixTime(eventsCopy[i].time[0]),
              end: fromUnixTime(eventsCopy[i].time[1]),
            },
            {
              start: fromUnixTime(eventsCopy[j].time[0]),
              end: fromUnixTime(eventsCopy[j].time[1]),
            },
            { inclusive: true }
          )
        ) {
          eventsCopy[i].collisions++;
          eventsCopy[j].collisions++;
        }
      }
    }
    calculateProperties(eventsCopy);

    return eventsCopy;
  };

  const calculateProperties = (events: Event[]) => {
    events.forEach((event) => {
      const overlappingEvents = events.filter((otherEvent) => {
        const firstEventStart = fromUnixTime(event.time[0]);
        const firstEventEnd = fromUnixTime(event.time[1]);
        const secondEventStart = fromUnixTime(otherEvent.time[0]);
        const secondEventEnd = fromUnixTime(otherEvent.time[1]);

        return areIntervalsOverlapping(
          { start: firstEventStart, end: firstEventEnd },
          { start: secondEventStart, end: secondEventEnd },
          { inclusive: true }
        );
      });

      overlappingEvents.sort((a, b) => {
        const durationA = a.time[1] - a.time[0];
        const durationB = b.time[1] - b.time[0];
        if (durationA !== durationB) {
          return durationB - durationA;
        }
        return a.id < b.id ? -1 : 1;
      });

      const positionIndex = overlappingEvents.findIndex(
        (overlap) => overlap.id === event.id
      );

      event.index = positionIndex;
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

  const calculateWidth = (event: Event, events: Event[]) => {
    const copyEvents = events.map((event: Event) => ({
      ...event,
      width: 100,
    }));

    copyEvents.forEach((el) => {
      if (
        (el.repeat === RepeatEvents.DAILY && el.repeatID === event.repeatID) ||
        el.id === event.id
      ) {
        event.width = el.width / (el.collisions + 1);
        return `${event.width}%`;
      }
    });

    return `${event.width}%`;
  };

  const calculateLeft = (event: Event, events: Event[]) => {
    const copyEvents = events.map((event: Event) => ({
      ...event,
      leftOffset: 0,
    }));

    copyEvents.forEach((el) => {
      if (
        (el.repeat === RepeatEvents.DAILY && el.repeatID === event.repeatID) ||
        el.id === event.id
      ) {
        event.leftOffset = (100 / (el.collisions + 1)) * el.index;
        return `${event.leftOffset}%`;
      }
    });

    return `${event.leftOffset}%`;
  };

  return {
    calculateCollisions,
    calculateLeft,
    calculateMinutes,
    calculateHeightPercentage,
    calculateWidth,
  };
};

export default useCalculate;

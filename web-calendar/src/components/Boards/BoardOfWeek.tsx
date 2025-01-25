import { useEffect, useState } from "react";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  getDate,
  lastDayOfMonth,
  startOfWeek,
  getUnixTime,
  parse,
  EachDayOfIntervalResult,
  subHours,
  addDays,
  isSameHour,
  fromUnixTime,
  setHours,
  isSameDay,
} from "date-fns";

import { Calendar } from "@/types/Calendar";
import Event from "@/types/Event";
import EventInfo from "../EventInfo/EventInfo";
import { listOfHours } from "@/utils/listOfTime";
import { RepeatEvents } from "@/enums/RepeatEvents";
import { ListOfDailyEvents } from "@/types/ListOfDailyEvents";
import useCalculate from "@/hooks/useCalculate";

interface BoardOfWeekProps {
  currentDate: Date;
  calendars: Calendar[];
  events: Event[];
  setEditable: (el: boolean) => void;
  setCurrentEvent?: (el: Event) => void;
  setVisibilityEdit: (el: boolean) => void;
}

const BoardOfWeek = ({
  currentDate,
  calendars,
  events,
  setEditable,
  setCurrentEvent,
  setVisibilityEdit,
}: BoardOfWeekProps) => {
  const [daysOfWeek, setDaysOfWeek] = useState<
    EachDayOfIntervalResult<
      {
        start: Date;
        end: Date;
      },
      undefined
    >
  >(
    eachDayOfInterval({
      start: new Date(startOfWeek(new Date(currentDate))),
      end: new Date(endOfWeek(new Date(currentDate))),
    })
  );
  const weekdays: string[] = daysOfWeek.map((day) => format(day, "EEE"));
  const currentDay: number = getDate(new Date());
  const [daysInWeek, setDaysInWeek] = useState<number[]>([]);
  const [startWeek, setStartWeek] = useState<number>(
    startOfWeek(new Date(currentDate)).getDate()
  );
  const [lastDayInMonth, setLastDayInMonth] = useState<number>(
    lastDayOfMonth(new Date(currentDate)).getDate()
  );
  const [visibilityInfoModal, setVisibilityInfoModal] =
    useState<boolean>(false);
  const [listOfDailyEvents, setListOfDailyEvents] =
    useState<ListOfDailyEvents>();

  const {
    calculateEventsForWeek,
    calculateCollisions,
    calculateHeightPercentage,
    calculateLeft,
    calculateMinutes,
    calculateWidth,
  } = useCalculate();

  useEffect(() => {
    setStartWeek(startOfWeek(new Date(currentDate)).getDate());
    setLastDayInMonth(lastDayOfMonth(new Date(currentDate)).getDate());
    setDaysOfWeek(
      eachDayOfInterval({
        start: new Date(startOfWeek(new Date(currentDate))),
        end: new Date(endOfWeek(new Date(currentDate))),
      })
    );
    setDaysInWeek([]);
  }, [currentDate]);

  useEffect(() => {
    //7 is a week
    for (let i = 0; i < 7; i++) {
      const day =
        startWeek + i <= lastDayInMonth
          ? startWeek + i
          : startWeek + i - lastDayInMonth;
      setDaysInWeek((prev) => [...prev, day]);
    }
  }, [startWeek]);

  useEffect(() => {
    const { currentWeekNumber, eventsByWeek } = calculateEventsForWeek(
      events,
      currentDate
    );
    const updatedEvents = calculateCollisions(eventsByWeek, currentWeekNumber);
    setListOfDailyEvents(updatedEvents);
  }, [events, currentDate]);

  const calculateId = (el: string, index: number) => {
    const currentDay = daysOfWeek[index];
    const parsedTime = parse(el, "h a", new Date(currentDate));
    const dayOfWeekDate = setHours(currentDay, parsedTime.getHours());

    return getUnixTime(subHours(dayOfWeekDate, 1));
  };

  const updateCurrentEvent = (el: Event) => {
    if (!visibilityInfoModal) {
      setVisibilityInfoModal(!visibilityInfoModal);
    }
    setCurrentEvent && setCurrentEvent(el);
  };

  const isEventOnDay = (event: Event, id: number): boolean => {
    const eventStartDate = new Date(event.timestamp * 1000);
    const halfYear = addDays(eventStartDate, 14);

    if (!event.repeat || event.repeat === RepeatEvents.DOES_NOT_REPEAT) {
      return isSameHour(eventStartDate, fromUnixTime(id));
    }

    if (event.repeat === RepeatEvents.DAILY) {
      const repeatID =
        (eventStartDate.getHours() === fromUnixTime(id).getHours() &&
          getUnixTime(eventStartDate) <= id &&
          getUnixTime(currentDate) <= getUnixTime(halfYear)) ||
        (isSameDay(eventStartDate, fromUnixTime(id)) &&
          isSameHour(eventStartDate, fromUnixTime(id)));
      if (repeatID) {
        const daysDifference =
          fromUnixTime(id).getDate() - eventStartDate.getDate();
        const updatedTimestamp = getUnixTime(
          addDays(new Date(event.timestamp * 1000), daysDifference)
        );
        event.repeatID = `${event.id}_${updatedTimestamp}`;
      }
      return (
        (eventStartDate.getHours() === fromUnixTime(id).getHours() &&
          getUnixTime(eventStartDate) <= id &&
          getUnixTime(currentDate) <= getUnixTime(halfYear)) ||
        (isSameDay(eventStartDate, fromUnixTime(id)) &&
          isSameHour(eventStartDate, fromUnixTime(id)))
      );
    }
    if (event.repeat === RepeatEvents.MONTHLY) {
      return (
        eventStartDate.getHours() === fromUnixTime(id).getHours() &&
        eventStartDate.getDate() === fromUnixTime(id).getDate() &&
        getUnixTime(currentDate) <= getUnixTime(halfYear)
      );
    }

    return false;
  };

  return (
    <>
      {
        <EventInfo
          events={events}
          isVisible={visibilityInfoModal}
          setEditable={setEditable}
          setVisibilityEdit={setVisibilityEdit}
          setVisibility={setVisibilityInfoModal}
        />
      }
      <section className="w-full rounded-lg bg-white">
        <div>
          <ul className="grid grid-cols-8 text-center border-b-2 shadow-md">
            <div className="border-r-2"></div>
            {weekdays.map((el: string, index: number) => {
              return (
                <div className="border-r-2" key={crypto.randomUUID()}>
                  <li
                    className={`py-2 flex m-2 flex-col ${
                      currentDay === daysInWeek[index]
                        ? "bg-currentDay rounded-lg"
                        : "bg-transparent"
                    }`}
                  >
                    <span className="font-bold">{daysInWeek[index]}</span>
                    {el}
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
        <section className="overflow-y-scroll no-scrollbar h-[79vh] ">
          {listOfHours.map((time: string) => {
            return (
              <div className="flex flex-row" key={crypto.randomUUID()}>
                <span className="text-center h-28 w-[14%] flex items-end justify-center -mb-2">
                  {time}
                </span>
                <div className="flex flex-row w-full">
                  {weekdays.map((_, index: number) => {
                    const id = calculateId(time, index);
                    return (
                      <div
                        className="border-b-2 border-l-2 w-[14.25%] relative"
                        id={id.toString()}
                        key={crypto.randomUUID()}
                      >
                        {events?.map((el: Event) => {
                          if (isEventOnDay(el, id) && el.calendar.isVisible) {
                            const currentCalendar: Calendar =
                              calendars.find(
                                (calendar) => calendar.name === el.calendar.name
                              ) || calendars[0];
                            const day = format(fromUnixTime(id), "P");
                            return (
                              <div
                                key={crypto.randomUUID()}
                                className={`bg-opacity-50 absolute z-40 rounded-lg p-2 cursor-pointer overflow-hidden ${calculateMinutes(
                                  el.timestamp
                                )} h-full`}
                                id={el.id}
                                style={{
                                  width: listOfDailyEvents
                                    ? calculateWidth(el, listOfDailyEvents, day)
                                    : "100%",
                                  left: listOfDailyEvents
                                    ? calculateLeft(el, listOfDailyEvents)
                                    : "0%",
                                  height: calculateHeightPercentage(
                                    el.time[0],
                                    el.time[1],
                                    el.allDay
                                  ),
                                  backgroundColor: currentCalendar?.color,
                                }}
                                onClick={() => updateCurrentEvent(el)}
                              >
                                <h2>{el.title}</h2>
                                <span className="text-sm">
                                  {el.description}
                                </span>
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </section>
    </>
  );
};

export default BoardOfWeek;

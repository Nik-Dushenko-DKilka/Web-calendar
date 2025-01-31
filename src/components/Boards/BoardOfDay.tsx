import { Calendar } from "@/types/Calendar";
import Event from "@/types/Event";
import { listOfHours } from "@/utils/listOfTime";
import {
  addDays,
  format,
  fromUnixTime,
  getDate,
  getUnixTime,
  isSameDay,
  isSameHour,
  parse,
  setDate,
  subHours,
} from "date-fns";
import { useState } from "react";
import EventInfo from "../EventInfo/EventInfo";
import { RepeatEvents } from "@/enums/RepeatEvents";
import useCalculate from "@/hooks/useCalculate";

interface BoardOfDayProps {
  currentDate: Date;
  events: Event[];
  calendars: Calendar[];
  setEditable: (el: boolean) => void;
  setVisibilityEdit: (el: boolean) => void;
  setCurrentEvent: (el: Event) => void;
}

const BoardOfDay = ({
  currentDate,
  events,
  calendars,
  setEditable,
  setCurrentEvent,
  setVisibilityEdit,
}: BoardOfDayProps) => {
  const [visibilityInfoModal, setVisibilityInfoModal] =
    useState<boolean>(false);

  const { calculateHeightPercentage, calculateMinutes } = useCalculate();

  const calculateId = (el: string) => {
    const parsedTime = parse(el, "h a", new Date(currentDate));
    const dayOfWeekDate = setDate(parsedTime, getDate(currentDate));

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
    const halfYear = addDays(eventStartDate, 182);

    if (!event.repeat || event.repeat === RepeatEvents.DOES_NOT_REPEAT) {
      return isSameHour(eventStartDate, fromUnixTime(id));
    }

    if (event.repeat === RepeatEvents.DAILY) {
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

  const calculateWidth = (timestamp: number) => {
    const eventDate = fromUnixTime(timestamp);
    const eventCount = events.reduce((accumulate, el: Event) => {
      const elDate = fromUnixTime(el.timestamp);

      if (
        elDate.getDate() === eventDate.getDate() &&
        elDate.getMonth() === eventDate.getMonth()
      ) {
        return accumulate + 1;
      }

      return accumulate;
    }, 0);
    const width = eventCount > 0 ? 100 / eventCount : 100;

    return `${width}%`;
  };

  const calculateLeft = (event: Event) => {
    const eventsOnSameDayAndHour = events.filter(
      (el: Event) =>
        fromUnixTime(el.timestamp).getDate() ===
          fromUnixTime(event.timestamp).getDate() &&
        fromUnixTime(el.timestamp).getMonth() ===
          fromUnixTime(event.timestamp).getMonth()
    );

    const eventIndex = eventsOnSameDayAndHour.findIndex(
      (el: Event) => el.id === event.id
    );

    const left = (eventIndex / eventsOnSameDayAndHour.length) * 100;

    return `${left}%`;
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
      <section className="w-full h-fit rounded-lg bg-white">
        <div className="flex border-b-2 shadow-md">
          <div className="w-[12%] border-r-2"></div>
          <div className="flex flex-col m-2 py-1 rounded-lg px-12 text-center bg-currentDay">
            <span className="font-bold">{format(currentDate, "d")}</span>
            <span className="font-bold">{format(currentDate, "EEEE")}</span>
          </div>
        </div>
        <section className="overflow-y-scroll no-scrollbar h-[79vh]">
          {listOfHours.map((time: string) => {
            const id = calculateId(time);
            return (
              <div className="flex" key={crypto.randomUUID()}>
                <span className="text-center h-28 w-[13.4%] flex items-end justify-center -mb-2">
                  {time}
                </span>
                <div className="flex flex-row w-full">
                  <div
                    className="border-b-2 border-l-2 w-full relative"
                    id={id.toString()}
                    key={crypto.randomUUID()}
                  >
                    {events?.map((el: Event) => {
                      if (isEventOnDay(el, id) && el.calendar.isVisible) {
                        const currentCalendar: Calendar =
                          calendars.find(
                            (calendar) => calendar.name === el.calendar.name
                          ) || calendars[0];
                        return (
                          <div
                            key={crypto.randomUUID()}
                            className={`bg-opacity-50 absolute rounded-lg p-2 z-40 cursor-pointer overflow-y-hidden ${calculateMinutes(
                              el.timestamp
                            )}`}
                            style={{
                              width: calculateWidth(id),
                              height: calculateHeightPercentage(
                                el.time[0],
                                el.time[1],
                                el.allDay
                              ),
                              left: calculateLeft(el),
                              backgroundColor: currentCalendar?.color,
                            }}
                            onClick={() => updateCurrentEvent(el)}
                          >
                            <h2>{el.title}</h2>
                            <span className="text-sm">{el.description}</span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </section>
    </>
  );
};

export default BoardOfDay;

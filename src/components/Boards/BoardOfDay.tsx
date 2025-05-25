import { Calendar } from "@/types/Calendar";
import Event from "@/types/Event";
import { listOfHours } from "@/utils/listOfTime";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  fromUnixTime,
  getUnixTime,
  isSameHour,
  lastDayOfMonth,
  parse,
  setHours,
  startOfWeek,
  subHours,
} from "date-fns";
import { useEffect, useState } from "react";
import EventInfo from "../EventInfo/EventInfo";
import useCalculate from "@/hooks/useCalculate";
import EventItem from "../EventItem/EventItem";

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
  const [daysOfWeek, setDaysOfWeek] = useState(
    eachDayOfInterval({
      start: startOfWeek(new Date(currentDate), { weekStartsOn: 1 }),
      end: endOfWeek(new Date(currentDate), { weekStartsOn: 1 }),
    })
  );
  const [daysInWeek, setDaysInWeek] = useState<number[]>([]);
  const [startWeek, setStartWeek] = useState<number>(
    startOfWeek(new Date(currentDate)).getDate()
  );
  const [lastDayInMonth, setLastDayInMonth] = useState<number>(
    lastDayOfMonth(new Date(currentDate)).getDate()
  );
  const [visibilityInfoModal, setVisibilityInfoModal] =
    useState<boolean>(false);
  const [updatedEvents, setUpdatedEvents] = useState<Event[]>(events);

  const { calculateCollisions } = useCalculate();

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
    const updatedEvents = calculateCollisions(events);
    setUpdatedEvents(updatedEvents);
  }, [events, currentDate]);

  const calculateId = (el: string): number => {
    const parsedTime = parse(el, "h a", new Date(currentDate));
    const dayWithTime = setHours(new Date(currentDate), parsedTime.getHours());

    return getUnixTime(subHours(dayWithTime, 1));
  };

  const updateCurrentEvent = (el: Event) => {
    if (!visibilityInfoModal) {
      setVisibilityInfoModal(!visibilityInfoModal);
    }
    setCurrentEvent && setCurrentEvent(el);
  };

  const isEventOnDay = (event: Event, id: number): boolean => {
    const eventStartDate = new Date(event.timestamp * 1000);
    return isSameHour(eventStartDate, fromUnixTime(id));
  };

  return (
    <>
      <EventInfo
        events={events}
        isVisible={visibilityInfoModal}
        setEditable={setEditable}
        setVisibilityEdit={setVisibilityEdit}
        setVisibility={setVisibilityInfoModal}
      />

      <section className="w-full h-fit rounded-lg bg-white dark:bg-darkSub">
        <div className="flex border-b-2 shadow-md">
          <div className="w-[12%] border-r-2"></div>
          <div className="flex flex-col m-2 py-1 rounded-lg px-12 text-center bg-currentDay dark:bg-darkBackgraund">
            <span className="font-bold">{format(currentDate, "d")}</span>
            <span className="font-bold">{format(currentDate, "EEEE")}</span>
          </div>
        </div>

        <section className="overflow-y-scroll no-scrollbar h-[79vh]">
          {listOfHours.map((time: string) => {
            const id = calculateId(time);
            return (
              <div className="flex relative" key={crypto.randomUUID()}>
                <span className="text-center h-28 w-[13.4%] flex items-end justify-center -mb-2">
                  {time}
                </span>
                <div className="flex flex-row w-full">
                  <div
                    className="border-b-2 border-l-2 w-full relative"
                    id={id.toString()}
                  >
                    {updatedEvents?.map((el: Event) => {
                      if (isEventOnDay(el, id) && el.calendar.isVisible) {
                        const currentCalendar: Calendar =
                          calendars.find(
                            (calendar) => calendar.name === el.calendar.name
                          ) || calendars[0];

                        return (
                          <EventItem
                            key={crypto.randomUUID()}
                            el={el}
                            events={updatedEvents}
                            updateCurrentEvent={updateCurrentEvent}
                            currentCalendar={currentCalendar}
                          />
                        );
                      }
                      return null;
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

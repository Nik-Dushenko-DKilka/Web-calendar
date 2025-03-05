import useCalculate from "@/hooks/useCalculate";
import { Calendar } from "@/types/Calendar";
import Event from "@/types/Event";
import { ListOfDailyEvents } from "@/types/ListOfDailyEvents";

interface EventItemProps {
  el: Event;
  day: string;
  currentCalendar: Calendar;
  listOfDailyEvents: ListOfDailyEvents;
  updateCurrentEvent: (el: Event) => void;
}

const EventItem = ({
  el,
  day,
  currentCalendar,
  listOfDailyEvents,
  updateCurrentEvent,
}: EventItemProps) => {
  const {
    calculateMinutes,
    calculateWidth,
    calculateLeft,
    calculateHeightPercentage,
  } = useCalculate();

  return (
    <div
      className={`absolute z-40 rounded-lg p-2 cursor-pointer overflow-hidden`}
      id={el.id}
      style={{
        top: calculateMinutes(el.timestamp),
        width: listOfDailyEvents
          ? calculateWidth(el, listOfDailyEvents, day)
          : "100%",
        left: listOfDailyEvents ? calculateLeft(el, listOfDailyEvents) : "0%",
        height: calculateHeightPercentage(el.time[0], el.time[1], el.allDay),
        backgroundColor: currentCalendar?.color,
      }}
      onClick={() => updateCurrentEvent(el)}
    >
      <h2>{el.title}</h2>
      <span className="text-sm">{el.description}</span>
    </div>
  );
};

export default EventItem;

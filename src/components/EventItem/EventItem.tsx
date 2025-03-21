import useCalculate from "@/hooks/useCalculate";
import { Calendar } from "@/types/Calendar";
import Event from "@/types/Event";

interface EventItemProps {
  el: Event;
  events: Event[];
  currentCalendar: Calendar;
  updateCurrentEvent: (el: Event) => void;
}

const EventItem = ({
  el,
  events,
  currentCalendar,
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
      className={`absolute z-40 rounded-lg p-2 cursor-pointer overflow-hidden border border-gray-400 `}
      id={el.id}
      style={{
        top: calculateMinutes(el.timestamp),
        width: calculateWidth(el, events),
        left: calculateLeft(el, events),
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

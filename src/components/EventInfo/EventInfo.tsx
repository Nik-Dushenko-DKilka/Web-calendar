import Image from "next/image";
import { useContext } from "react";

import { EditableEventContext } from "../CalendarBoard/CalendarBoard";
import formatTime from "@/utils/formatTime";
import Event from "@/types/Event";

interface EventInfoProps {
  isVisible: boolean;
  events: Event[];
  setEditable: (el: boolean) => void;
  setVisibilityEdit: (el: boolean) => void;
  setVisibility: (el: boolean) => void;
}

const EventInfo = ({
  isVisible,
  setEditable,
  setVisibilityEdit,
  setVisibility,
}: EventInfoProps) => {
  const context = useContext(EditableEventContext);
  if (context === null) {
    return;
  }
  const { currentEvent, eventIsVisible, setEvents } = context;

  const editEvent = () => {
    setEditable(true);
    setVisibility(!isVisible);
    setVisibilityEdit(!eventIsVisible);
  };

  const deleteEventData = () => {
    setEvents((prev) => prev.filter((el: Event) => el.id !== currentEvent?.id));
    setVisibility(!isVisible);
  };

  const closeModal = () => {
    setEditable(false);
    setVisibility(!isVisible);
  };

  return (
    isVisible &&
    currentEvent && (
      <>
        <section className="absolute top-1/3 left-1/3 w-1/3 dark:border dark:border-gray-400 bg-white dark:bg-darkSub rounded-lg p-4 shadow-md z-50">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Event information</h1>
            <div className="flex">
              <Image
                src={"/svg/edit-icon.svg"}
                alt="edit an event"
                height={0}
                width={0}
                className="cursor-pointer w-4 h-4 dark:invert"
                onClick={editEvent}
              />
              <Image
                src={"/svg/delete-icon.svg"}
                alt="delete an event"
                height={0}
                width={0}
                onClick={deleteEventData}
                className="mx-2 cursor-pointer w-4 h-4 dark:invert"
              />
              <Image
                src={"/svg/cross-icon.svg"}
                alt="close an event"
                height={0}
                width={0}
                className="cursor-pointer w-4 h-4 dark:invert"
                onClick={closeModal}
              />
            </div>
          </div>
          <hr />
          <div className="flex mt-4">
            <Image
              src={"/svg/text-icon.svg"}
              alt="delete an event"
              height={0}
              width={0}
              className="mr-2 w-4 h-4 self-center"
            />
            <h2 className="text-2xl">{currentEvent.title}</h2>
          </div>
          <div className="flex mt-4">
            <Image
              src={"/svg/clock-icon.svg"}
              alt="delete an event"
              height={0}
              width={0}
              className="mr-2 w-4 h-4 self-center"
            />
            <div>
              {formatTime(currentEvent)}
              <div>
                {currentEvent.allDay ? "All day, " : ""}
                {currentEvent.repeat === "Does not repeat"
                  ? ""
                  : currentEvent.repeat}
              </div>
            </div>
          </div>
          <div className="flex mt-4">
            <Image
              src={"/svg/calendar-icon.svg"}
              alt="delete an event"
              height={0}
              width={0}
              className="mr-2 w-4 h-4 self-center"
            />
            <span>{currentEvent.calendar.name}</span>
          </div>
          <div className="flex mt-4">
            <Image
              src={"/svg/description-icon.svg"}
              alt="delete an event"
              height={0}
              width={0}
              className="mr-2 w-4 h-4 self-center"
            />
            {currentEvent.description}
          </div>
        </section>
      </>
    )
  );
};

export default EventInfo;

import { useContext, useEffect, useState } from "react";
import {
  addHours,
  format,
  fromUnixTime,
  getUnixTime,
  parse,
  startOfDay,
} from "date-fns";
import Image from "next/image";

import Button from "../Buttons/Button";
import Input from "../Input/Input";
import SelectMenu from "../SelectMenu/SelectMenu";
import Checkbox from "../Checkbox/Checkbox";
import DatePicker from "../DatePicker/DatePicker";

import { saveToLocalStorageWithPrevState } from "@/localStorage/localStorage";
import Event from "@/types/Event";
import { Calendar } from "@/types/Calendar";
import { listOfMinutes } from "@/utils/listOfTime";
import { ErrorMessage } from "@/types/ErrorMessage";
import { EditableEventContext } from "../CalendarBoard/CalendarBoard";
import { NewEvent } from "@/types/NewEvent";
import { defaultEvent } from "@/constants/defaultEvent";

interface CreateEventProps {
  calendars: Calendar[];
  isVisible: boolean;
  editable?: boolean;
  setEditable?: (el: boolean) => void;
  setVisibility: (el: boolean) => void;
  setEvents: (el: (prev: Event[]) => Event[]) => void;
}

const CreateEvent = ({
  isVisible,
  calendars,
  editable,
  setEditable,
  setEvents,
  setVisibility,
}: CreateEventProps) => {
  const editableEvent = useContext(EditableEventContext)?.currentEvent;
  const [errorMessages, setErrorMessages] = useState<Partial<ErrorMessage>>({});
  const [newEvent, setNewEvent] = useState<NewEvent>({
    ...defaultEvent,
    calendar: calendars[0],
  });
  const [event, setEvent] = useState<Event | null>();
  const startOfTime = getUnixTime(
    addHours(startOfDay(fromUnixTime(newEvent.timestamp)), 5)
  );

  useEffect(() => {
    setErrorMessages((prev) => {
      return {
        ...prev,
        time: newEvent.time[0] > newEvent.time[1],
        title: !newEvent.title.length,
      };
    });
  }, [newEvent.title, newEvent.time]);

  useEffect(() => {
    setNewEvent({
      ...newEvent,
      timestamp: getUnixTime(
        new Date(
          newEvent.date + " " + format(fromUnixTime(newEvent.time[0]), "p")
        )
      ),
    });
  }, [newEvent.time, newEvent.date]);

  useEffect(() => {
    if (editable && editableEvent) {
      setNewEvent({
        title: editableEvent.title,
        date: format(
          fromUnixTime(editableEvent.timestamp),
          "yyyy-MM-dd"
        ).toString(),
        timestamp: editableEvent.timestamp,
        time: [editableEvent.time[0], editableEvent.time[1]],
        allDay: editableEvent.allDay,
        calendar: editableEvent.calendar,
        description: editableEvent.description,
      });
    }
  }, [editableEvent, editable]);

  useEffect(() => {
    if (!editable) {
      setNewEvent({
        ...defaultEvent,
        time: [startOfTime, startOfTime],
        calendar: calendars[0],
      });
    }
  }, [isVisible]);

  const selectTime = (
    event: React.ChangeEvent<HTMLSelectElement>,
    isFirstSelect: boolean = false
  ) => {
    const selectedTimeString = event.target.value;
    if (!selectedTimeString) {
      return;
    }

    const parsedDate = parse(
      selectedTimeString,
      "h:mm a",
      new Date(newEvent.date)
    );
    const unixTime = getUnixTime(parsedDate);

    const currentTime = newEvent.time;

    const updatedTime: [number, number] = isFirstSelect
      ? [unixTime, currentTime?.[1] ?? unixTime]
      : [currentTime?.[0] ?? unixTime, unixTime];

    setNewEvent({ ...newEvent, time: updatedTime });
  };

  const saveEventData = () => {
    if (errorMessages.title || errorMessages.time) {
      return;
    }

    const updatedEvent: Event = {
      id: crypto.randomUUID(),
      title: newEvent.title,
      timestamp: newEvent.timestamp,
      time: newEvent.time,
      allDay: newEvent.allDay,
      calendar: newEvent.calendar,
      description: newEvent.description,
      collisions: 0,
      width: 100,
      leftOffset: 0,
      index: 0,
    };

    if (editable) {
      setEvents((prev: Event[]) =>
        prev.map((el: Event) =>
          el.id === editableEvent?.id ? { ...el, ...newEvent } : el
        )
      );
      setEditable && setEditable(false);
    } else {
      if (!event || event.id !== updatedEvent.id) {
        setEvent(updatedEvent);
        setEvents((prev: Event[]) =>
          prev ? [...prev, updatedEvent] : [updatedEvent]
        );
        saveToLocalStorageWithPrevState(updatedEvent, "events");
      }
    }
    setVisibility(!isVisible);
  };

  const closeModal = () => {
    setVisibility && setVisibility(!isVisible);

    if (editable && setEditable) {
      setEditable && setEditable(false);
    }
  };

  const changeCalendar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const calendar: Calendar =
      calendars.find((el: Calendar) => el.name === e.target.value) ||
      calendars[0];
    setNewEvent({ ...newEvent, calendar: calendar });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setter: (item: NewEvent) => void,
    name: string
  ) => {
    setter({ ...newEvent, [name]: e.target.value });
  };

  return (
    <section
      className={`bg-white dark:bg-darkSub w-1/3 p-6 rounded-lg absolute top-[25%] z-50 left-[35.5%] border-2 ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <div className="flex flex-row justify-between border-b-2">
        <h2 className="self-center font-bold text-lg">
          {editable ? "Edit event" : "Create event"}
        </h2>
        {
          <Button
            onClick={closeModal}
            isPrimary={false}
            icon={"/svg/cross-icon.svg"}
            styles="border-none dark:bg-transparent dark:invert"
          />
        }
      </div>
      <div className="flex flex-row">
        <Image
          src={"svg/text-icon.svg"}
          alt="text-icon"
          width={0}
          height={0}
          className="self-center mt-10 h-4 w-4"
        />
        <Input
          title="Title"
          style="w-full mt-4 ml-2"
          placeholder="Enter Title"
          type="text"
          isError={errorMessages.title}
          value={newEvent.title}
          onChange={(e) => handleChange(e, setNewEvent, "title")}
        />
      </div>
      <div className="flex flex-row justify-between mt-4">
        <Image
          src={"svg/clock-icon.svg"}
          alt="clock-icon"
          width={0}
          height={0}
          className="mt-8 h-4 w-4"
        />
        <div className="-ml-4">
          <h2>Date</h2>
          <DatePicker
            value={newEvent.date}
            onChange={(e) => handleChange(e, setNewEvent, "date")}
            style="-ml-2 border-none h-1/2 p-0 pl-2"
          />
          <hr className="border-black" />
        </div>
        <SelectMenu
          title="Time"
          options={listOfMinutes}
          style={"self-center"}
          isError={errorMessages.time}
          isDisabled={newEvent.allDay}
          defaultValue={
            editable ? format(fromUnixTime(newEvent.time[0]), "p") : "5:00 AM"
          }
          onChange={(e) => selectTime(e, true)}
        />
        <span className="self-center mt-6">-</span>
        <SelectMenu
          options={listOfMinutes}
          style={"self-center mt-6"}
          isError={errorMessages.time}
          isDisabled={newEvent.allDay}
          defaultValue={format(fromUnixTime(newEvent.time[1]), "p")}
          onChange={(e) => selectTime(e, false)}
        />
      </div>
      <div className="mt-4 flex flex-row">
        <Checkbox
          checkboxColor="green"
          labelFor="repeat"
          checked={newEvent.allDay}
          onChange={(e) =>
            setNewEvent({ ...newEvent, allDay: e.target.checked })
          }
          text="All day"
          style="ml-[7%]"
        />
      </div>
      <h3 className="mt-4 ml-8">Calendar</h3>
      <div className="flex flex-row">
        <Image
          src={"svg/calendar-icon.svg"}
          alt="calendar icon"
          height={16}
          width={16}
          className="mr-4"
        />
        {calendars && (
          <SelectMenu
            defaultValue={editableEvent?.calendar}
            options={calendars}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              changeCalendar(e)
            }
            style="w-full"
          />
        )}
      </div>
      <div className="flex flex-row mt-4">
        <Image
          src={"svg/description-icon.svg"}
          alt="calendar icon"
          height={0}
          width={0}
          className="mr-4 mt-4 h-4 w-4"
        />
        <Input
          title="Description"
          value={newEvent.description}
          onChange={(e) => handleChange(e, setNewEvent, "description")}
          type="text"
          style="w-full"
        />
      </div>
      <Button
        onClick={saveEventData}
        isDisabled={errorMessages.title || errorMessages.time}
        text="Save"
        styles="float-right mt-4 w-1/4"
      />
    </section>
  );
};

export default CreateEvent;

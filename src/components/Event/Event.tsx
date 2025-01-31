import { useContext, useEffect, useState } from "react";
import {
  addHours,
  format,
  fromUnixTime,
  getTime,
  getUnixTime,
  parse,
  startOfDay,
} from "date-fns";
import Image from "next/image";

import Button from "../Button/Button";
import Input from "../Input/Input";
import SelectMenu from "../SelectMenu/SelectMenu";
import Checkbox from "../Checkbox/Checkbox";
import DatePicker from "../DatePicker/DatePicker";

import { RepeatEvents } from "@/enums/RepeatEvents";
import { saveToLocalStorageWithPrevState } from "@/localStorage/localStorage";
import Event from "@/types/Event";
import { Calendar } from "@/types/Calendar";
import { listOfMinutes } from "@/utils/listOfTime";
import { ErrorMessage } from "@/types/ErrorMessage";
import { EditableEventContext } from "../CalendarBoard/CalendarBoard";

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
  const [task, setTask] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [event, setEvent] = useState<Event | null>();
  const [timestamp, setTimestamp] = useState<number>(getUnixTime(new Date()));
  const [allDay, setAllDay] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<string>(RepeatEvents.DOES_NOT_REPEAT);
  const [calendar, setCalendar] = useState<Calendar>(calendars[0]);
  const [date, setDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd").toString()
  );
  const [errorMessages, setErrorMessages] = useState<Partial<ErrorMessage>>({});
  const startOfTime = getUnixTime(
    addHours(startOfDay(fromUnixTime(timestamp)), 5)
  );
  const [time, setTime] = useState<number[]>([startOfTime, startOfTime]);

  useEffect(() => {
    !task.length
      ? setErrorMessages((prev) => {
          return { ...prev, title: true };
        })
      : setErrorMessages((prev) => {
          return { ...prev, title: false };
        });

    time[0] > time[1]
      ? setErrorMessages((prev) => {
          return { ...prev, time: true };
        })
      : setErrorMessages((prev) => {
          return { ...prev, time: false };
        });
  }, [task, time]);

  useEffect(() => {
    setTimestamp(
      getUnixTime(new Date(date + " " + format(fromUnixTime(time[0]), "p")))
    );
  }, [time, date]);

  useEffect(() => {
    if (!editable) {
      setTime([timestamp, timestamp]);
    }
  }, [timestamp]);

  useEffect(() => {
    if (editable && editableEvent) {
      setTask(editableEvent.title);
      setDate(
        format(fromUnixTime(editableEvent.timestamp), "yyyy-MM-dd").toString()
      );
      setTime([editableEvent.time[0], editableEvent.time[1]]);
      setAllDay(editableEvent.allDay);
      setRepeat(editableEvent.repeat);
      setCalendar(editableEvent.calendar);
      setDescription(editableEvent.description);
    }
  }, [editableEvent, editable]);

  useEffect(() => {
    if (!editable) {
      setTask("");
      setDate(format(new Date(), "yyyy-MM-dd"));
      setTime([startOfTime, startOfTime]);
      setAllDay(false);
      setRepeat(RepeatEvents.DOES_NOT_REPEAT);
      setCalendar(calendars[0]);
      setDescription("");
    }
  }, [isVisible, event]);

  const selectTime = (
    event: React.ChangeEvent<HTMLSelectElement>,
    isFirstSelect: boolean = false
  ) => {
    const selectedTimeString = event.target.value;
    const parsedDate = parse(selectedTimeString, "h:mm a", new Date(date));

    const unixTime = getUnixTime(parsedDate);

    if (selectedTimeString) {
      setTime(
        isFirstSelect
          ? [
              unixTime,
              editable && editableEvent ? editableEvent.time[1] : startOfTime,
            ]
          : [time[0], unixTime]
      );
    } else {
      setTime([startOfTime, startOfTime]);
    }
  };

  const saveEvent = () => {
    if (errorMessages.title || errorMessages.time) {
      return;
    }

    const newEvent = {
      id: crypto.randomUUID(),
      title: task,
      timestamp: timestamp,
      time: time,
      allDay: allDay,
      repeat: repeat,
      calendar: calendar,
      description: description,
    };

    if (editable) {
      setEvents((prev: Event[]) =>
        prev.map((el: Event) =>
          el.id === editableEvent?.id ? { ...el, ...newEvent } : el
        )
      );
      setEditable && setEditable(false);
    } else {
      if (!event || event.id !== newEvent.id) {
        setEvent(newEvent);
        setEvents((prev: Event[]) => (prev ? [...prev, newEvent] : [newEvent]));
        saveToLocalStorageWithPrevState(newEvent, "events");
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
    setCalendar(calendar);
  };

  return (
    <section
      className={`bg-white w-1/3 p-6 rounded-lg absolute top-[25%] z-50 left-[35.5%] border-2 ${
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
            style="border-none"
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
          value={task}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTask(e.target.value)
          }
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
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDate(e.target.value)
            }
            style="-ml-2 border-none h-1/2 p-0 pl-2"
          />
          <hr className="border-black" />
        </div>
        <SelectMenu
          title="Time"
          options={listOfMinutes}
          style={"self-center"}
          isError={errorMessages.time}
          isDisabled={allDay ? true : false}
          defaultValue={format(fromUnixTime(time[0]), "p") ?? "5:00 AM"}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            selectTime(e, true)
          }
        />
        <span className="self-center mt-6">-</span>
        <SelectMenu
          options={listOfMinutes}
          style={"self-center mt-6"}
          isError={errorMessages.time}
          isDisabled={allDay ? true : false}
          defaultValue={format(fromUnixTime(time[1]), "p")}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            selectTime(e, false)
          }
        />
      </div>
      <div className="mt-4 flex flex-row">
        <Checkbox
          checkboxColor="green"
          labelFor="repeat"
          checked={allDay}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAllDay(e.target.checked)
          }
          text="All day"
          style="ml-[7%]"
        />
        <SelectMenu
          defaultValue={editableEvent?.repeat}
          options={Object.values(RepeatEvents)}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setRepeat(e.target.value)
          }
          style="ml-6"
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
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
          type="text"
          style="w-full"
        />
      </div>
      {
        <Button
          onClick={saveEvent}
          isDisabled={errorMessages.title || errorMessages.time ? true : false}
          text="Save"
          style="float-right mt-4 w-1/4"
        />
      }
    </section>
  );
};

export default CreateEvent;

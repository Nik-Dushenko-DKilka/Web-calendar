import Image from "next/image";
import { useEffect, useState } from "react";

import Button from "../Buttons/Button";
import ColorPicker from "../ColorPicker/ColorPicker";
import { colorPalette } from "@/constants/colors";
import { Calendar } from "@/types/Calendar";
import Input from "../Input/Input";
import Event from "@/types/Event";

interface CreateCalendarProps {
  title: string;
  isVisible: boolean;
  calendars: Calendar[];
  isEdit?: boolean;
  calendar: Calendar;
  events?: Event[];
  setEvents?: (e: Event[]) => void;
  setIsEdit: (e: boolean) => void;
  setVisibility: (e: boolean) => void;
  setCalendars: (e: Calendar[]) => void;
}

const ListOfCalendar = ({
  title,
  isVisible,
  calendars,
  isEdit = false,
  calendar,
  events,
  setEvents,
  setIsEdit,
  setCalendars,
  setVisibility,
}: CreateCalendarProps) => {
  const [newCalendar, setNewCalendar] = useState<Calendar>({
    id: "",
    name: "",
    color: "",
    isVisible: true,
  });
  const [selectColor, setSelectColor] = useState<string>("#fff");
  const [prevCalendar, setPrevCalendar] = useState<Calendar>();

  useEffect(() => {
    if (isEdit) {
      setNewCalendar(calendar);
      setSelectColor(calendar.color);
    }
  }, [isEdit, calendar]);

  useEffect(() => {
    if (events && setEvents) {
      const newEvents: Event[] = events.map((el: Event) => {
        if (el.calendar.name === prevCalendar?.name) {
          el.calendar = newCalendar;
        }
        return el;
      });
      setEvents(newEvents);
    }
  }, [prevCalendar]);

  const saveCalendar = () => {
    if (isEdit) {
      const updatedCalendars = calendars.map((cal) =>
        cal.id === calendar.id ? { ...newCalendar, color: selectColor } : cal
      );
      setCalendars(updatedCalendars);
      setIsEdit(false);
    } else {
      const newCal: Calendar = {
        ...newCalendar,
        id: String(Date.now()),
        color: selectColor,
      };
      setCalendars([...calendars, newCal]);
    }
    setVisibility(false);
  };

  const updateCalendar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrevCalendar(newCalendar);
    setNewCalendar((prev) => ({ ...prev, name: e.target.value }));
  };

  return (
    <div
      className={`${
        isVisible ? "block" : "hidden"
      } absolute w-fit left-[40%] top-1/3 z-50 dark:bg-darkSub bg-white light:bg-white p-4 rounded-lg shadow-lg`}
    >
      <div className="flex justify-between self-center">
        <h2 className="font-bold text-2xl mb-2">{title}</h2>
        <Button
          onClick={() => setVisibility(false)}
          isPrimary={false}
          icon={"/svg/cross-icon.svg"}
          styles="border-none dark:bg-transparent dark:invert"
        />
      </div>
      <hr />
      <div className="flex my-2">
        <Image
          src={"/svg/text-icon.svg"}
          alt="text icon for create calendar modal"
          width={16}
          height={16}
          className="mr-2 w-4 h-4 self-center mt-6"
        />
        <Input
          title="Title"
          placeholder="Enter title"
          type="text"
          value={newCalendar?.name}
          onChange={updateCalendar}
        />
      </div>
      <div className="flex">
        <Image
          src={"/svg/palette-icon.svg"}
          alt="palette icon"
          width={16}
          height={16}
          className="self-center mt-6 mr-2 w-4 h-4"
        />
        <ColorPicker
          colors={colorPalette}
          selectColor={selectColor}
          setSelectedColor={setSelectColor}
        />
      </div>
      <Button text="Save" styles="float-right mt-2" onClick={saveCalendar} />
    </div>
  );
};

export default ListOfCalendar;

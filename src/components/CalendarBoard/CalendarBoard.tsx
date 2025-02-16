import { createContext, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

import Button from "../Button/Button";
import DatePicker from "../DatePicker/DatePicker";
import BoardOfDay from "../Boards/BoardOfDay";
import BoardOfWeek from "../Boards/BoardOfWeek";
import Event from "../Event/Event";
import Checkbox from "../Checkbox/Checkbox";
import ListOfCalendar from "../ListOfCalendar/ListOfCalendar";

import { Calendar } from "@/types/Calendar";
import {
  getFromLocalStorage,
  saveToLocalStorageWithoutPrevState,
} from "@/localStorage/localStorage";
import EventType from "@/types/Event";

interface CalendarBoardProps {
  isDayView: boolean;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

interface EventContext {
  currentEvent: EventType | null;
  eventIsVisible: boolean;
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>;
}

export const EditableEventContext = createContext<EventContext | null>(null);

const CalendarBoard = ({
  isDayView,
  currentDate,
  setCurrentDate,
}: Required<CalendarBoardProps>) => {
  const [eventIsVisible, setEventIsVisible] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<EventType>();
  const [isCalendarModal, setIsCalendarModal] = useState<boolean>(false);
  const [isEditCalendar, setIsEditCalendar] = useState<boolean>(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [editable, setEditable] = useState<boolean>(false);
  const [checkboxChange, setCheckboxChange] = useState<boolean>(true);
  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [calendars, setCalendars] = useState<Calendar[]>([
    {
      id: crypto.randomUUID(),
      name: "Work",
      color: "green",
      isVisible: true,
    },
  ]);
  const [currentCalendar, setCurrentCalendar] = useState<Calendar>(
    calendars[0]
  );
  const [editableCalendar, setEditableCalendar] = useState<Calendar>(
    calendars[0]
  );

  const calendarsFromStorage: Calendar[] = getFromLocalStorage("calendars");

  useEffect(() => {
    const data = getFromLocalStorage("events");
    setCalendars(calendarsFromStorage);
    setEvents(data ?? []);
  }, []);

  useEffect(() => {
    saveToLocalStorageWithoutPrevState(calendars, "calendars");
  }, [calendars]);

  useEffect(() => {
    if (!firstRender) {
      saveToLocalStorageWithoutPrevState(events, "events");
    } else {
      setFirstRender(false);
    }
  }, [events]);

  const editCalendar = (calendar: string) => {
    setEditableCalendar(
      calendars.filter((el: Calendar) => el.name === calendar)[0]
    );
    setIsCalendarModal(!isCalendarModal);
    setIsEditCalendar(true);
  };

  const deleteCalendar = (calendar: string) => {
    if (calendars.length <= 1) return;
    const newCalendars = calendars.filter((el: Calendar) => {
      return el.id !== calendar;
    });
    const newEvents = events?.filter((el: EventType) => {
      return el?.calendar?.name !== calendar;
    });

    setCalendars(newCalendars);
    setEvents(newEvents !== undefined ? newEvents : []);
    saveToLocalStorageWithoutPrevState(newEvents, "events");
  };

  const createCalendar = () => {
    setIsCalendarModal(!isCalendarModal);
    if (isEditCalendar) {
      setIsEditCalendar(false);
    }
  };

  useEffect(() => {
    setCalendars((prev) => {
      return prev?.map((el: Calendar) => {
        return el.id === currentCalendar?.id
          ? { ...el, isVisible: checkboxChange }
          : el;
      });
    });
    events &&
      setEvents((prev) => {
        //this one
        return prev?.map((el: EventType) => {
          return el?.calendar?.name === currentCalendar?.name
            ? {
                ...el,
                calendar: { ...currentCalendar, isVisible: checkboxChange },
              }
            : el;
        });
      });
  }, [checkboxChange]);

  return (
    <EditableEventContext.Provider
      value={{
        currentEvent: currentEvent ? currentEvent : null,
        eventIsVisible: eventIsVisible,
        setEvents: setEvents,
      }}
    >
      <main className="pt-8 pr-12 pl-8 flex bg-[#fffcdc] dark:bg-[#000323]">
        <Event
          editable={editable}
          calendars={calendars}
          isVisible={eventIsVisible}
          setEditable={setEditable}
          setVisibility={setEventIsVisible}
          setEvents={setEvents}
        />
        <ListOfCalendar
          title={`${isEditCalendar ? "Edit calendar" : "Create calendar"}`}
          calendar={editableCalendar}
          isEdit={isEditCalendar}
          calendars={calendars}
          isVisible={isCalendarModal}
          events={events}
          setEvents={setEvents}
          setIsEdit={setIsEditCalendar}
          setVisibility={setIsCalendarModal}
          setCalendars={setCalendars}
        />

        <aside className="flex flex-col w-1/6 ">
          <Button
            text="+ Create"
            onClick={() => setEventIsVisible(!eventIsVisible)}
            style="w-full"
          />
          <DatePicker
            value={format(currentDate, "yyyy-MM-dd")}
            style="mt-4 w-full"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrentDate(parseISO(e.target.value))
            }
          />
          <div className="bg-white dark:bg-[#2c2e41] rounded-lg p-4 mt-4">
            <div className="flex justify-between">
              <h2 className="font-bold">My calendars</h2>
              <Button
                icon="/svg/plus-icon.svg"
                style="border-none dark:bg-transparent dark:invert -mt-2.5 hover:bg-white"
                isPrimary={false}
                onClick={createCalendar}
              />
            </div>
            {calendars.map((el: Calendar) => {
              return (
                <div
                  key={el.id}
                  className="flex hover:bg-[#EFEFEF] dark:hover:bg-[#000323] cursor-pointer p-2 pr-0 rounded-lg"
                >
                  <Checkbox
                    checkboxColor={el.color}
                    labelFor={`calendar-${el.name}`}
                    checked={el.isVisible}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCurrentCalendar(el);
                      setCheckboxChange(e.target.checked);
                    }}
                  />
                  <span className="self-center w-[70%]">{el.name}</span>
                  <Button
                    icon={"svg/delete-icon.svg"}
                    onClick={() => deleteCalendar(el.id)}
                    isPrimary={false}
                    style="border-none bg-transparent dark:invert"
                  />
                  <Button
                    icon={"svg/edit-icon.svg"}
                    onClick={() => editCalendar(el.name)}
                    isPrimary={false}
                    style="border-none bg-transparent dark:invert"
                  />
                </div>
              );
            })}
          </div>
        </aside>
        <section className="w-5/6 ml-16">
          {isDayView ? (
            <BoardOfDay
              currentDate={currentDate}
              events={events}
              calendars={calendars}
              setCurrentEvent={setCurrentEvent}
              setEditable={setEditable}
              setVisibilityEdit={setEventIsVisible}
            />
          ) : (
            <BoardOfWeek
              currentDate={currentDate}
              calendars={calendars}
              events={events}
              setEditable={setEditable}
              setCurrentEvent={setCurrentEvent}
              setVisibilityEdit={setEventIsVisible}
            />
          )}
        </section>
      </main>
    </EditableEventContext.Provider>
  );
};

export default CalendarBoard;

"use client";
import Image from "next/image";

import Button from "@/components/Button/Button";
import Dropdown from "../DropDown/Dropdown";
import { addDays, addWeeks, format, subDays, subWeeks } from "date-fns";

interface HeaderProps {
  currentDate: Date;
  isDayView: boolean;
  setCurrentDate: (el: Date) => void;
  setIsDayView: (el: boolean) => void;
}
const Header = ({
  currentDate,
  isDayView,
  setIsDayView,
  setCurrentDate,
}: HeaderProps) => {
  const view: object = { week: "Week", day: "Day" };

  const increaseMonth = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const decreaseMonth = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const increaseDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const decreaseDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  return (
    <header className="border-b-2 shadow-md flex flex-row relative bg-white">
      <Image
        src={"/svg/logo.svg"}
        alt="logo icon"
        className="w-52 h-auto my-4 ml-6"
        width={0}
        height={0}
      ></Image>
      <Button
        text="Today"
        onClick={() => setCurrentDate(new Date())}
        style="h-fit ml-6 self-center"
      />
      <Button
        icon="/svg/left-icon.svg"
        isPrimary={false}
        onClick={isDayView ? decreaseDay : decreaseMonth}
        style="h-fit ml-6 self-center"
      />
      <Button
        icon="/svg/right-icon.svg"
        isPrimary={false}
        onClick={isDayView ? increaseDay : increaseMonth}
        style="h-fit ml-4 self-center"
      />
      <div className="block self-center text-xl font-bold">
        <span className="ml-4">
          {isDayView
            ? format(currentDate, "MMMM d yyyy")
            : format(currentDate, "MMMM yyyy")}
        </span>
        <span className={`ml-2 ${isDayView ? "inline" : "hidden"}`}></span>
      </div>
      <Dropdown
        labelFor="view"
        options={view}
        onChange={() => setIsDayView(!isDayView)}
        style="self-center absolute right-56"
      />
      <div className="self-center absolute right-12 flex flex-row">
        {/* Todo: add username and icon from auth */}
        <span className="self-center">{"Username"}</span>
        <Image
          src={"svg/cross-icon.svg"}
          alt="user icon"
          height={0}
          width={0}
          className="w-8 h-8 rounded-full ml-4 border-2"
        ></Image>
      </div>
    </header>
  );
};

export default Header;

import {
  addDays,
  EachDayOfIntervalResult,
  format,
  getDate,
  getMonth,
} from "date-fns";

interface HeaderOfBoardProps {
  daysInWeek: number[];
  currentDate: Date;
  daysOfWeek: EachDayOfIntervalResult<
    {
      start: Date;
      end: Date;
    },
    undefined
  >;
}

const HeaderOfBoard = ({
  daysInWeek,
  currentDate,
  daysOfWeek,
}: HeaderOfBoardProps) => {
  const currentDay: Date = new Date();

  return (
    <div>
      <ul className="grid grid-cols-8 text-center border-b-2 shadow-md bg-lightMain dark:bg-darkMain">
        <div className="border-r-2"></div>
        {daysOfWeek.map((el: Date, index: number) => {
          return (
            <div className="border-r-2" key={crypto.randomUUID()}>
              <li
                className={`py-2 flex m-2 flex-col ${
                  getDate(currentDay) === daysInWeek[index + 1] &&
                  getDate(currentDay) === currentDate.getDate() &&
                  getMonth(currentDay) === currentDate.getMonth()
                    ? "bg-currentDay dark:bg-darkSub rounded-lg"
                    : "bg-transparent"
                }`}
              >
                <span className="font-bold">{format(addDays(el, 1), "d")}</span>
                {format(addDays(el, 1), "EEE")}
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default HeaderOfBoard;

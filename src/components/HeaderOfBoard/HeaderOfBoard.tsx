import { getDate } from "date-fns";

interface HeaderOfBoardProps {
  daysInWeek: number[];
  weekdays: string[];
}

const HeaderOfBoard = ({ daysInWeek, weekdays }: HeaderOfBoardProps) => {
  const currentDay: number = getDate(new Date());

  return (
    <div>
      <ul className="grid grid-cols-8 text-center border-b-2 shadow-md bg-lightMain dark:bg-darkMain">
        <div className="border-r-2"></div>
        {weekdays.map((el: string, index: number) => {
          return (
            <div className="border-r-2" key={crypto.randomUUID()}>
              <li
                className={`py-2 flex m-2 flex-col ${
                  currentDay === daysInWeek[index]
                    ? "bg-currentDay dark:bg-darkSub rounded-lg"
                    : "bg-transparent"
                }`}
              >
                <span className="font-bold">{daysInWeek[index]}</span>
                {el}
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default HeaderOfBoard;

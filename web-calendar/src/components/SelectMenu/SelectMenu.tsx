import { Calendar } from "@/types/Calendar";
import { useEffect, useState } from "react";

interface SelectMenuProps {
  title?: string;
  style?: string;
  defaultValue?: Calendar | string;
  options: string[] | Calendar[];
  isError?: boolean;
  isDisabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectMenu = ({
  title,
  options,
  defaultValue,
  style,
  isError,
  isDisabled = false,
  onChange,
}: SelectMenuProps) => {
  const [selectedValue, setSelectedValue] = useState<string>();
  const [list, setList] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    return onChange(event);
  };

  useEffect(() => {
    const listOfOptions = options.map((el) =>
      typeof el === "string" ? el : el.name
    );

    setList(listOfOptions);
  }, [options]);

  useEffect(() => {
    defaultValue && setSelectedValue(defaultValue.toString());
  }, [defaultValue]);

  return (
    <>
      <label
        htmlFor={title}
        className={`${style} border-b ${
          isError ? "border-[#FF5620]" : "border-black"
        }`}
      >
        <h2>{title}</h2>
        <select
          disabled={isDisabled}
          name={title}
          id={title}
          value={selectedValue}
          defaultValue={defaultValue?.toString()}
          className={`pr-4 outline-none appearance-none cursor-pointer w-full ${
            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onChange={handleChange}
        >
          {list.map((el) => {
            return (
              <option key={crypto.randomUUID()} value={el.toString()}>
                {el.toString()}
              </option>
            );
          })}
        </select>
      </label>
    </>
  );
};

export default SelectMenu;

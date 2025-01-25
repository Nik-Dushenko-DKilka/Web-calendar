interface DropdownProps {
  labelFor: string;
  options: object;
  style?: string;
  onChange: () => void;
}

const Dropdown = ({ labelFor, options, style, onChange }: DropdownProps) => {
  return (
    <label htmlFor={labelFor} className={`w-fit ${style}`}>
      <select
        name={labelFor}
        id={labelFor}
        onChange={onChange}
        className="p-2 pr-6 border rounded-lg hover:bg-[#EFEFEF] active:bg-[#E0E0E0] cursor-pointer appearance-none outline-none"
      >
        {Object.values(options).map((el: any) => {
          return (
            <option key={el} value={el}>
              {el}
            </option>
          );
        })}
      </select>
      <img
        src={"svg/down-icon.svg"}
        alt="down small icon"
        className="absolute top-3 right-2"
      />
    </label>
  );
};

export default Dropdown;

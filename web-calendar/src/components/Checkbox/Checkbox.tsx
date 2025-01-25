interface CheckboxProps {
  labelFor: string;
  text?: string;
  style?: string;
  checkboxColor?: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({
  labelFor,
  text,
  style,
  checkboxColor,
  checked = true,
  onChange,
}: CheckboxProps) => {
  return (
    <label htmlFor={labelFor} className={`flex items-center ${style}`}>
      <span className="relative flex items-center">
        <input
          type="checkbox"
          id={labelFor}
          checked={checked}
          onChange={onChange}
          className={`appearance-none h-5 w-5 rounded border`}
          style={{
            backgroundColor: checked ? checkboxColor : "transparent",
          }}
        />
        {checked && (
          <img
            src={"svg/check-icon.svg"}
            alt="icon"
            className="absolute w-4 h-4 left-0.5 top-0.5"
          />
        )}
      </span>
      <span className="ml-2 align-top">{text}</span>
    </label>
  );
};

export default Checkbox;

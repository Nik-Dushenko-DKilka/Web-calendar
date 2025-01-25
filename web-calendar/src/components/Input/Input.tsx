interface InputProps {
  title: string;
  type: string;
  value: string;
  icon?: string;
  style?: string;
  isError?: boolean;
  isDisabled?: boolean;
  errorMessage?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
}

const Input = ({
  title,
  type,
  icon,
  style,
  isDisabled,
  errorMessage,
  placeholder,
  value,
  isError,
  onChange,
  onClick,
}: InputProps) => {
  return (
    <label htmlFor={title} className={`${style}`}>
      <h2>{title}</h2>
      <div className="relative">
        <input
          type={type}
          value={value}
          id={title}
          placeholder={placeholder}
          disabled={isDisabled}
          onChange={onChange}
          className={`w-full outline-none disabled:bg-transparent disabled:cursor-not-allowed border-b ${
            isError ? "border-[#FF5620]" : "border-[#737373]"
          }`}
        />
        {icon && (
          <img
            src={icon}
            alt="password-icon"
            onClick={onClick}
            className="absolute right-1 top-1"
          />
        )}
      </div>
      <p className="text-[#FF5620]">{errorMessage}</p>
    </label>
  );
};

export default Input;

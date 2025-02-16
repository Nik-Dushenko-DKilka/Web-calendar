interface ButtonProps {
  text?: string;
  icon?: string;
  style?: string;
  isPrimary?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

const Button = ({
  text,
  icon,
  isPrimary = true,
  isDisabled,
  style,
  onClick,
}: Partial<ButtonProps>) => {
  return (
    <button
      className={`p-2 ${
        isPrimary
          ? "bg-lightMain dark:bg-darkMain text-black dark:text-white disabled:bg-[#b1b1b1] active:bg-lightMain dark:active:bg-darkMain active:opacity-50"
          : "bg-white text-black disabled:bg-[#C8C8C8] hover:bg-[#EFEFEF] active:bg-[#C8C8C8] border"
      } rounded-lg ${style}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {icon && (
        <img
          src={icon}
          alt={`${icon} icon`}
          className={`${isPrimary ? "text-white dark:invert" : "text-black"}`}
        />
      )}
      {text}
    </button>
  );
};

export default Button;

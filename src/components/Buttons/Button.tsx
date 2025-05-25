interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  text?: string;
  icon?: string;
  styles?: string;
  isPrimary?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

const Button = ({
  text,
  icon,
  isPrimary = true,
  isDisabled,
  styles,
  onClick,
}: Partial<ButtonProps>) => {
  return (
    <button
      className={`p-2 ${
        isPrimary
          ? "bg-lightMain dark:bg-darkMain text-black dark:text-white disabled:bg-[#b1b1b1] active:bg-lightMain dark:active:bg-darkMain dark:disabled:bg-[#C8C8C8] active:opacity-50"
          : "bg-white text-black disabled:bg-[#C8C8C8] dark:disabled:bg-[#C8C8C8] hover:bg-[#EFEFEF] active:bg-[#C8C8C8] border"
      } rounded-lg ${styles}`}
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

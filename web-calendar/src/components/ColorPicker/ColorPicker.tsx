interface ColorPickerProps {
  colors: string[];
  selectColor: string;
  setSelectedColor: (e: string) => void;
}

const ColorPicker = ({
  selectColor,
  colors,
  setSelectedColor,
}: ColorPickerProps) => {
  const changeColor = (color: string) => {
    return colors.map((el) => {
      if (el === color) {
        return setSelectedColor(color);
      }
    });
  };

  return (
    <section>
      <h2>Colors</h2>
      <div className="w-fit">
        <ul className="flex flex-wrap border-2 rounded-md">
          {colors.map((color) => {
            return (
              <li
                key={color}
                style={{ backgroundColor: color }}
                className={`
                h-4 w-4 rounded-md m-2 hover:cursor-pointer ${
                  selectColor === color
                    ? "border-2 border-white ring-2 ring-black"
                    : "border-none"
                }`}
                onClick={() => changeColor(color)}
              ></li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ColorPicker;

interface DatePickerProps {
  value: string;
  style?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DatePicker = ({ value, style, onChange }: DatePickerProps) => {
  return (
    <label htmlFor="date-picker">
      <input
        onChange={onChange}
        type="date"
        id="date-picker"
        value={value}
        className={`p-2 rounded-lg border border-gray-200 ${style}`}
      />
    </label>
  );
};

export default DatePicker;

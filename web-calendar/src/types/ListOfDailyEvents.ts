export type DailyEvent = {
  id: number | string;
  timestamp: number;
  startTime: number;
  endTime: number;
  collisions: number;
  leftOffset?: number;
  width?: number;
  repeat?: string;
  repeatID?: string | number;
};

export type ListOfDailyEvents = {
  [date: string]: DailyEvent[];
};

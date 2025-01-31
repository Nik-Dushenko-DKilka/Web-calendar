import Event from "@/types/Event";
import { LocalStorage } from "./services/services";
import { Calendar } from "@/types/Calendar";

export const saveToLocalStorageWithPrevState = (
  item: Event | Event[],
  key: string
) => {
  const previousEvents: Event[] = getFromLocalStorage(key) || [];
  const newItems: Event[] = Array.isArray(item) ? item : [item];
  const events: Event[] = [...previousEvents, ...newItems];

  return LocalStorage().setItem(key, events);
};

export const saveToLocalStorageWithoutPrevState = (
  item: Calendar[] | Event[],
  key: string
) => {
  return LocalStorage().setItem(key, item);
};

export const getFromLocalStorage = (key: string) => {
  return LocalStorage().getItem(key);
};

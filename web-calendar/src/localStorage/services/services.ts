import { Calendar } from "@/types/Calendar";
import Event from "@/types/Event";

export const LocalStorage = () => {
  const setItem = (key: string, item: Event[] | Calendar[]) => {
    return localStorage.setItem(key, JSON.stringify(item));
  };

  const getItem = (key: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      const item = localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    }
  };

  return { setItem, getItem };
};

import { setHours, setMinutes } from 'date-fns';

export function getBase64(img: File, callback: (img: string) => void): void {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result!.toString()));
  reader.readAsDataURL(img);
}

export const isBase64 = (str: string) => {
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(str);
};

export const mergeDatetTime = (date: Date, time: Date) => {
  return setMinutes(setHours(date, time.getHours()), time.getMinutes());
};

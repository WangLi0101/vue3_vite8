import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

/** 格式化时间 */
export function formatTime(
  time: string | number | Date | null | undefined,
  format = "YYYY-MM-DD HH:mm:ss",
) {
  if (time === null || time === undefined || time === "") return null;
  return dayjs(time).format(format);
}

// 秒设置为0
export function formatTimeNoSecond(time: string | number | Date, format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(time).second(0).format(format);
}

/** 日期是否在指定日期之后 */
export const isDateAfter = (date: string | number | Date, after: string | number | Date) => {
  return dayjs(date).isAfter(dayjs(after));
};

/** 日期是否在指定日期之前 */
export const isDateBefore = (date: string | number | Date, before: string | number | Date) => {
  return dayjs(date).isBefore(dayjs(before));
};

/** 转为UTC时间字符串 */
export function toUTC(time: string | number | Date | null | undefined) {
  if (time === null || time === undefined || time === "") return null;
  return dayjs(time).utc().toISOString();
}

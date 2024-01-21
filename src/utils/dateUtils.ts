import dayjs from "dayjs";

export function formatDate(dateString: string, format: string = "YYYY-MM-DD") {
  if (dateString) {
    const date = dayjs(dateString);
    return date.format(format);
  } else {
    return null;
  }
}

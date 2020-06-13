import moment from "moment-jalaali";
export function shamsiFromISoDate(date) {
  return moment(date, "YYYY-MM-DDTHH:mm:ss.000Z").format("jYYYY/jM/jD HH:mm");
}

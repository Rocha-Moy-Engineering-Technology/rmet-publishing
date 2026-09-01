const MONTH_NAMES: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_ABBREVIATIONS: readonly string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEKDAY_ABBREVIATIONS: readonly string[] = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDate(date: Date): string {
  return `${date.getUTCDate()} ${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toRfc822Date(date: Date): string {
  const weekday = WEEKDAY_ABBREVIATIONS[date.getUTCDay()];
  const month = MONTH_ABBREVIATIONS[date.getUTCMonth()];
  const day = pad(date.getUTCDate());
  const time = `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
  return `${weekday}, ${day} ${month} ${date.getUTCFullYear()} ${time} GMT`;
}

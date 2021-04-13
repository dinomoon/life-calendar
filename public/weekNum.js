function isLeap(year) {
  if (year % 400 == 0) return true;
  if (year % 100 == 0) return false;
  if (year % 4 == 0) return true;
  return false;
}

function pYear(year) {
  return (
    (year +
      Math.floor(year / 4) -
      Math.floor(year / 100) +
      Math.floor(year / 400)) %
    7
  );
}

function lastWeek(year) {
  if (pYear(year) == 4 || pYear(year - 1) == 3) {
    return 53;
  } else {
    return 52;
  }
}

function ordinalDay(date) {
  let ordinal_table = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  if (isLeap(date.getFullYear()))
    for (let i = 2; i < ordinal_table.length; i++) ordinal_table[i] += 1;

  return ordinal_table[date.getMonth()] + date.getDate();
}

export function weekNumber(date) {
  let ordinal_day = ordinalDay(date);
  let current_year = date.getFullYear();
  let weekday = date.getDay();
  let week = Math.floor((ordinal_day - weekday + 10) / 7);

  if (week < 1) return lastWeek(current_year - 1);
  if (week > lastWeek(current_year)) return 1;
  return week;
}

const MONTH_COLUMNS = 7;
const MONTH_ROWS = 6;
const MONTH_DAYS = MONTH_COLUMNS * MONTH_ROWS;

export class DayEnumItem {
	constructor(ordinal, value) {
		this.ordinal = ordinal;
		this.value = value;
		this.short = value.substring(0, 3);
	}
}

export const DayEnum = {
	0: new DayEnumItem(0, "Sunday"),
	1: new DayEnumItem(1, "Monday"),
	2: new DayEnumItem(2, "Tuesday"),
	3: new DayEnumItem(3, "Wednesday"),
	4: new DayEnumItem(4, "Thursday"),
	5: new DayEnumItem(5, "Friday"),
	6: new DayEnumItem(6, "Saturday"),
}

export class Day {
	constructor(date) {
		this.date = date;
		let now = new Date();
		this.isCurrentMonth = now.getMonth() === date.getMonth();
		this.isCurrentDay = now.getDate() === date.getDate() && now.getMonth() === date.getMonth();
	}
}

export function getDaysInMonth(month, year) {
	// Although months are 0 indexed we are not doing -1 here because we're interested in the next month's 0th day
	// Which is effectively the current month's last day which is effectively the count of days of the current month
	return new Date(year, month, 0).getDate();
}

export function getDayAt(date) {
	let day = date.getUTCDay();
	return DayEnum[day];
}

export function getFirstDayInMonth(month, year) {
	month -= 1;
	// Because this damned time is in whatever the fuck that isn't UTC
	// It displays time in current time I guess??? But it's actually UTC???
	// So the displayed date is actually offset by +1 hours
	// So 00:00 on Feb 02 is actually 23:00 on Feb 01
	// So we have to get the 2nd day (which is actually 23:00 on the 1st) to get the first day
	// Likewise when getting the last day we have to get the 1st day on the next month
	// Which is actually the last day of the current month......................
	// OR we could get the 1st day at 01:00 (which in turn would be 00:00 on the 1st)
	return getDayAt(new Date(year, month, 1, 12));
}

export function getLastDayInMonth(month, year) {
	month -= 1;
	// 0th day of the next month is effectively the last day of the current month
	return getDayAt(new Date(year, month + 1, 0, 12));
}

export function getLastNDays(month, year, n) {
	let days = [];
	let daysInMonth = getDaysInMonth(month, year);
	for (let i = daysInMonth; i > (daysInMonth - n); i--) {
		days.push(new Date(year, month - 1, i, 12));
	}
	return days.reverse();
}

export function getFirstNDays(month, year, n) {
	let days = [];
	// 1 because days are 1 indexed (while months are 0 indexed)
	for (let i = 1; i < n + 1; i++) {
		days.push(new Date(year, month - 1, i, 12));
	}
	return days;

}

export function buildMonth(month, year) {
	let firstDay = getFirstDayInMonth(month, year);

	let numPreviousMonthDays = firstDay.ordinal;
	// There is NO -1 here because we want the next month's day count (which is effectively month without the -1)
	let numNextMonthDays = MONTH_DAYS - numPreviousMonthDays - getDaysInMonth(month, year);

	let previousMonthDays = getLastNDays(month - 1, year, numPreviousMonthDays);
	let nextMonthDays = getFirstNDays(month + 1, year, numNextMonthDays);

	let days = []
	days.push(...previousMonthDays);
	days.push(...getFirstNDays(month, year, getDaysInMonth(month, year)));
	days.push(...nextMonthDays);

	return days.map(day => new Day(day));
}

export class API {
	constructor() {
		this.root = `http://localhost:9001/api/`
	}

	getWorkDayHours(date) {
		return fetch(`${this.root}workday?date=${date}`)
			.then(res => res.json())
			.then(res => res.reduce((acc, cur) => acc + cur.hours, 0));
	}

	getOvertimeHours(date) {
		return fetch(`${this.root}overtime?date=${date}`)
			.then(res => res.json())
			.then(res => res.reduce((acc, cur) => acc + cur.hours, 0));
	}
}

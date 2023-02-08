export class API {
	constructor() {
		this.root = `http://localhost:9001/api/`
	}

	getAllWorkDayHours(date) {
		return fetch(`${this.root}workday?date=${date}`)
			.then(res => res.json());
	}

	getAllOvertimeHours(date) {
		return fetch(`${this.root}overtime?date=${date}`)
			.then(res => res.json());
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

	removeWorkHour(id) {
		return fetch(`${this.root}workday?id=${id}`, {
			method: 'DELETE'
		});
	}

	removeOvertimeHour(id) {
		return fetch(`${this.root}overtime?id=${id}`, {
			method: 'DELETE'
		});
	}

	addWorkhours(date, hours) {
		hours = parseInt(hours);
		return fetch(`${this.root}workday`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				                     date: date,
				                     hours: hours
			                     })
		}).then(res => res.json());
	}

	addOvertime(date, hours, description) {
		hours = parseInt(hours);
		description = "None";
		return fetch(`${this.root}overtime`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				                     date: date,
				                     hours: hours,
				                     description: description
			                     })
		}).then(res => res.json());
	}
}

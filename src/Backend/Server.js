const Database = require('better-sqlite3');
const {readFileSync} = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const SERVER_PORT = process.env.SERVER_PORT || 9001;

function makeDatabase(...args) {
	const db = new Database(...args);
	const begin = db.prepare('BEGIN');
	const commit = db.prepare('COMMIT');
	const rollback = db.prepare('ROLLBACK');
	db.begin = () => begin.run();
	db.commit = () => commit.run();
	db.rollback = () => rollback.run();
	db.pragma('journal_mode = WAL');
	return db;
}

const db = makeDatabase('db.db');
const INIT_SQL = readFileSync('init.sql', 'utf8');
db.exec(INIT_SQL);

let PREPARED_STATEMENTS = {
	day_insert: 'INSERT INTO day (day, month, year) VALUES (?, ?, ?)',
	day_select: 'SELECT * FROM day WHERE id = ?',
	day_select_by_date: 'SELECT * FROM day WHERE day = ? AND month = ? AND year = ?',
	day_update: 'UPDATE day SET day = ?, month = ?, year = ? WHERE id = ?',
	day_delete: 'DELETE FROM day WHERE id = ?',
	day_select_all: 'SELECT * FROM day',
	day_select_by_month: 'SELECT * FROM day WHERE month = ?',

	work_day_insert: 'INSERT INTO work_day (day, hours) VALUES (?, ?)',
	work_day_select: 'SELECT * FROM work_day WHERE id = ?',
	work_day_select_by_day: 'SELECT * FROM work_day WHERE day = ?',
	work_day_update: 'UPDATE work_day SET hours = ? WHERE id = ?',
	work_day_delete: 'DELETE FROM work_day WHERE id = ?',
	work_day_select_all: 'SELECT * FROM work_day',

	overtime_insert: 'INSERT INTO overtime (day, hours, description) VALUES (?, ?, ?)',
	overtime_select: 'SELECT * FROM overtime WHERE id = ?',
	overtime_select_by_day: 'SELECT * FROM overtime WHERE day = ?',
	overtime_update: 'UPDATE overtime SET hours = ?, description = ? WHERE id = ?',
	overtime_delete: 'DELETE FROM overtime WHERE id = ?',
	overtime_select_all: 'SELECT * FROM overtime',
}
PREPARED_STATEMENTS = Object.entries(PREPARED_STATEMENTS).reduce((acc, [key, value]) => {
	acc[key] = db.prepare(value);
	return acc;
}, {});

class DayRepository {
	constructor() {
		this.db = db;
	}

	findAll() {
		return PREPARED_STATEMENTS.day_select_all.all();
	}

	findByMonth(month) {
		return PREPARED_STATEMENTS.day_select_by_month.all(String(month));
	}

	findById(id) {
		return PREPARED_STATEMENTS.day_select.get(id);
	}

	findByDate(day, month, year) {
		return PREPARED_STATEMENTS.day_select_by_date.get(String(day), String(month), String(year));
	}

	save(day, month, year) {
		let insertRowid = PREPARED_STATEMENTS.day_insert.run(String(day), String(month), String(year)).lastInsertRowid;
		return this.findById(insertRowid);
	}

	saveIfNoExists(day, month, year) {
		const existing = this.findByDate(day, month, year);
		if (existing) {
			return existing.id;
		}
		return this.save(day, month, year).id;
	}

	update(id, day, month, year) {
		return PREPARED_STATEMENTS.day_update.run(day, month, year, id);
	}

	deleteById(id) {
		return PREPARED_STATEMENTS.day_delete.run(id);
	}
}

class WorkDayRepository {
	constructor() {
		this.db = db;
	}

	findAll() {
		return PREPARED_STATEMENTS.work_day_select_all.all();
	}

	findByDayId(dayId) {
		return PREPARED_STATEMENTS.work_day_select_by_day.all(dayId);
	}

	findById(id) {
		return PREPARED_STATEMENTS.work_day_select.get(id);
	}

	save(dayId, hours) {
		let insertRowid = PREPARED_STATEMENTS.work_day_insert.run(dayId, hours).lastInsertRowid;
		return this.findById(insertRowid);
	}

	update(id, hours) {
		return PREPARED_STATEMENTS.work_day_update.run(hours, id);
	}

	deleteById(id) {
		return PREPARED_STATEMENTS.work_day_delete.run(id);
	}
}

class OvertimeRepository {
	constructor() {
		this.db = db;
	}

	findAll() {
		return PREPARED_STATEMENTS.overtime_select_all.all();
	}

	findByDayId(dayId) {
		return PREPARED_STATEMENTS.overtime_select_by_day.all(dayId);
	}

	findById(id) {
		return PREPARED_STATEMENTS.overtime_select.get(id);
	}

	save(dayId, hours, description) {
		let insertRowid = PREPARED_STATEMENTS.overtime_insert.run(dayId, hours, description).lastInsertRowid;
		return this.findById(insertRowid);
	}

	update(id, hours, description) {
		return PREPARED_STATEMENTS.overtime_update.run(hours, description, id);
	}

	deleteById(id) {
		return PREPARED_STATEMENTS.overtime_delete.run(id);
	}
}

class API {
	constructor() {
		this.db = db;
	}

	createNewWorkDay(date, hours) {
		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();

		let dayId = dayRepository.saveIfNoExists(day, month, year);
		return workDayRepository.save(dayId, hours);
	}

	addOvertime(date, hours, description) {
		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();

		let dayId = dayRepository.saveIfNoExists(day, month, year);
		return overtimeRepository.save(dayId, hours, description);
	}
}

const dayRepository = new DayRepository();
const workDayRepository = new WorkDayRepository();
const overtimeRepository = new OvertimeRepository();
const api = new API();

const app = express();
app.use(bodyParser.json());
app.use(cors())

const ROOT_ROUTE = '/api';

class DateValidator {
	constructor() {
	}

	validate(date, res) {
		if (date.toString() === 'Invalid Date') {
			res.status(400).send('Invalid date');
		}
	}
}

const dateValidator = new DateValidator();

class DayController {
	constructor() {
		this.route = `${ROOT_ROUTE}/day`;

		app.get(`${this.route}`, (req, res) => {
			if (req.query.id) {
				res.json(dayRepository.findById(req.query.id));
			} else if (req.query.date) {
				const date = new Date(req.query.date);
				dateValidator.validate(date, res);
				res.json(dayRepository.findByDate(date.getDate(), date.getMonth() + 1, date.getFullYear()));
			} else {
				res.json(dayRepository.findAll());
			}
		});
	}
}

class WorkDayController {
	constructor() {
		this.route = `${ROOT_ROUTE}/workday`;

		app.get(`${this.route}`, (req, res) => {
			if (req.query.day) {
				res.json(workDayRepository.findByDayId(req.query.day));
			} else if (req.query.id) {
				res.json(workDayRepository.findById(req.query.id));
			} else if (req.query.date) {
				const date = new Date(req.query.date);
				dateValidator.validate(date, res);

				const day = dayRepository.findByDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
				if (!!!day) {
					res.json([]);
					return;
				}
				res.json(workDayRepository.findByDayId(day.id));
			} else {
				res.json(workDayRepository.findAll());
			}
		});

		app.post(`${this.route}`, (req, res) => {
			let hours = req.body.hours;
			if (!!!hours) {
				hours = 8;
			}

			let date = new Date(req.body.date);
			dateValidator.validate(date, res);

			let workDay = api.createNewWorkDay(date, hours);
			res.status(200).send(workDay);
		});

		app.delete(`${this.route}`, (req, res) => {
			let id = req.query.id;
			if (!!!id) {
				res.status(400).send('Invalid or missing id');
				return;
			}

			workDayRepository.deleteById(id);
			res.status(200).send('OK');
		});
	}
}

class OvertimeController {
	constructor() {
		this.route = `${ROOT_ROUTE}/overtime`;

		app.get(`${this.route}`, (req, res) => {
			if (req.query.day) {
				res.json(overtimeRepository.findByDayId(req.query.day));
			} else if (req.query.id) {
				res.json(overtimeRepository.findById(req.query.id));
			} else if (req.query.date) {
				const date = new Date(req.query.date);
				dateValidator.validate(date, res);
				const day = dayRepository.findByDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
				if (!!!day) {
					res.json([]);
					return;
				}
				res.json(overtimeRepository.findByDayId(day.id));
			} else {
				res.json(overtimeRepository.findAll());
			}
		});

		app.post(`${this.route}`, (req, res) => {
			let hours = req.body.hours;
			if (!!!hours) {
				res.status(400).send('Invalid or missing hours');
				return;
			}

			let date = new Date(req.body.date);
			dateValidator.validate(date, res);

			let description = req.body.description;
			if (!!!description) {
				res.status(400).send('Invalid or missing description');
				return;
			}

			let overtime = api.addOvertime(date, hours, description);
			res.status(200).send(overtime);
		});

		app.delete(`${this.route}`, (req, res) => {
			let id = req.query.id;
			if (!!!id) {
				res.status(400).send('Invalid or missing id');
				return;
			}

			overtimeRepository.deleteById(id);
			res.status(200).send('OK');
		});
	}
}

const dayController = new DayController();
const workDayController = new WorkDayController();
const overtimeController = new OvertimeController();

app.listen(SERVER_PORT, () => {
	console.log(`Server listening on port ${SERVER_PORT}`);
});

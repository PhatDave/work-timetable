CREATE TABLE IF NOT EXISTS 'day'
(
    'id'    INTEGER PRIMARY KEY AUTOINCREMENT,
    'day'   TEXT NOT NULL,
    'month' TEXT NOT NULL,
    'year'  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS 'work_day'
(
    'id'    INTEGER PRIMARY KEY AUTOINCREMENT,
    'hours' INTEGER NOT NULL,
    'day'   INTEGER NOT NULL,
    FOREIGN KEY ('day') REFERENCES 'day' ('id')
);

CREATE TABLE IF NOT EXISTS 'overtime'
(
    'id'          INTEGER PRIMARY KEY AUTOINCREMENT,
    'hours'       INTEGER NOT NULL,
    'description' TEXT    NOT NULL,
    'day'         INTEGER NOT NULL,
    FOREIGN KEY ('day') REFERENCES 'day' ('id')
);

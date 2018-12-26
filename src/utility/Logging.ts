import { transports, format, createLogger } from "winston";
const { combine, timestamp, printf, colorize } = format;

const printFormat = printf(info => {
	return `${info.timestamp} ${info.level}: ${info.message}`;
});

const fileOptions = {
	level: "info",
	filename: "app.log",
	format: combine(
		timestamp({
			format: "YYYY-MM-DD hh:mm:ss A ZZ"
		}),
		format.json()
	),
	maxsize: 1024
};

const consoleOptions = {
	level: "silly",
	colorize: true,
	format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), printFormat)
};

const logger = createLogger({
	transports: [new transports.Console(consoleOptions), new transports.File(fileOptions)]
});

export default logger;

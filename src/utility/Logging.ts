import { transports, format, createLogger } from "winston";
const { combine, timestamp, printf } = format;

import * as moment from "moment";

const printFormat = printf(info => {
	return `${moment(info.timestamp).format("YYYY-MM-DD HH:mm:ss")} ${info.level}: ${info.message}`;
});

const fileOptions = {
	level: "info",
	format: combine(timestamp(), printFormat, format.json()),
	filename: "app.log"
};

const consoleOptions = {
	level: "silly",
	format: combine(timestamp(), printFormat)
};

const logger = createLogger({
	transports: [new transports.Console(consoleOptions), new transports.File(fileOptions)]
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new transports.Console({
			format: format.simple()
		})
	);
}

export default logger;

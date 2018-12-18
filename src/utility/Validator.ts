import { Message } from "discord.js";
import { getUserMention, getUserByID } from "./Utils";

export interface IValidator {
	(value: any, message: Message): {
		isValid: boolean;
		invalidMessage?: string;
		normalizedValue?: any;
	};
}

const isInteger: IValidator = value => {
	const expected = Number(value);
	const test = !isNaN(expected);

	return {
		isValid: test,
		invalidMessage: !test ? `${value} is not an Number` : undefined,
		normalizedValue: test ? Math.floor(expected) : undefined
	};
};

const isUserMention: IValidator = (value, message) => {
	const expected = getUserMention(message) || getUserByID(message, value);
	const test = !!expected;

	return {
		isValid: test,
		invalidMessage: !test ? `${value} is not an User` : undefined,
		normalizedValue: test ? expected : undefined
	};
};

export default <{ [key: string]: IValidator | undefined }>{ isUserMention, isInteger };

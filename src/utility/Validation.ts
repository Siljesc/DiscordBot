import { ICommandContext } from "../handlers/Command";
import { getUserByID } from "./Utils";

const validators : {
	[key: string]: IValidator
} = {};

export interface IValidator {
	(value: any, ctx: ICommandContext): {
		isValid: boolean;
		error: string;
		evaluated: any;
	}
}

validators.Number = (value) => {
	const evaluated = Math.floor(Number(value));

	return {
		isValid: !isNaN(evaluated),
		error: `Value must be an Integer. Input: ${value}`,
		evaluated
	}
};

validators.User = (value, ctx) => {
	const evaluated = getUserByID(ctx.message, value);

	return {
		isValid: !!evaluated,
		error: `Value must be an existing User. Input: ${value}`,
		evaluated
	}
};

validators.Snowflake = (value) => {
	return {
		isValid: value.length === 18,
		error: `Value must be an Snowflake`,
		evaluated: value
	}
};


export default validators;
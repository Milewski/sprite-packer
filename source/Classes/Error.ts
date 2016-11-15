const chalk = require('chalk');

export class Error {
    static DIR = 'Error creating directory. It might be due to permissions or it might be currently in use.';

    /**
     * Handle Errors
     */
    static handle(error: NodeJS.ErrnoException | string, num: number = 1): void {

        let message,
            codeNumber: any;

        if (typeof (error) === 'string') {
            message = error;
            codeNumber = num;
        } else if (error instanceof Error) {
            message = error.message;
            codeNumber = error.code;
        }

        console.error(chalk.yellow(message));

        process.exit(codeNumber);

    }

}
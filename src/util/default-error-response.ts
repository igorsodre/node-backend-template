import os from 'os';
export class ServerErrorResponse extends Error {
    constructor(message?: string, public code?: number, err?: Error) {
        super(message);
        if (err && err.message) {
            this.message += os.EOL + '[[ ' + err.message + ' ]]';
        }
    }
}

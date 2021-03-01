type IAppTokenFormat = {
    userId: string;
    email?: string;
};
declare namespace Express {
    export interface Request {
        appData?: IAppTokenFormat;
    }
}

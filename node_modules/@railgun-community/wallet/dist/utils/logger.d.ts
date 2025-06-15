export declare const sendMessage: (msg: string) => void;
export declare const sendErrorMessage: (err: Error | string) => void;
export declare const setLoggers: (logFunc: Optional<(msg: string) => void>, errorFunc: Optional<(err: Error | string) => void>) => void;

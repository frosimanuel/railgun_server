"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLoggers = exports.sendErrorMessage = exports.sendMessage = void 0;
let log;
let error;
const sendMessage = (msg) => {
    if (log)
        log(msg);
};
exports.sendMessage = sendMessage;
const sendErrorMessage = (err) => {
    if (error)
        error(err);
};
exports.sendErrorMessage = sendErrorMessage;
const setLoggers = (logFunc, errorFunc) => {
    log = logFunc;
    error = errorFunc;
};
exports.setLoggers = setLoggers;
//# sourceMappingURL=logger.js.map
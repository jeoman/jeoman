let winston = require('winston'); //로그 처리 모듈
let winstonDaily = require('winston-daily-rotate-file'); //로그 일별 처리 모듈
let moment = require('moment'); //시간 처리 모듈

function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
};

let logger = new (winston.Logger)({
    transports : [
        new (winstonDaily)({
            name : 'info-file',
            filename : './log/server',
            datePattern : '_yyyy-MM-dd.log',
            colorize : false,
            maxsize : 50000000,
            maxFiles : 1000,
            level : 'info',
            showLevel : true,
            json : false,
            timestamp : timeStampFormat
        }),
        new (winston.transports.Console)({
            name : 'debug-console',
            conlorize : true,
            level : 'debug',
            showLevel : true,
            json : false,
            timestamp : timeStampFormat
         })
    ],
    exceptionHandlers:[
        new(winstonDaily)({
            name : 'exceptoin-file',
            filename : './log/exception',
            datePattern : '_yyyy-MM-dd.log',
            colorize : false,
            maxsize : 50000000,
            maxFiles: 1000,
            level : 'error',
            showLevel : true,
            json : false,
            timestamp : timeStampFormat
        }),
        new(winston.transports.Console)({
            name: 'exception-console',
            colorize : true,
            level : 'debug',
            showLevel : true,
            json : false,
            timestamp : timeStampFormat
        })
    ]
});


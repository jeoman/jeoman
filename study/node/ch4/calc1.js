let util = require('util');
let EventEmitter = require('events').EventEmitter;

let Calc = ()=>{
    let self = this;

    this.on('stop', ()=>{
        console.log('Calc에 stop event 전달됨');
    });
};

util.inherits(Calc, EventEmitter);
Calc.prototype.add = (a,b)=>{
    return a+b;
}

module.exports = Calc;
module.exports.title = 'calculator';
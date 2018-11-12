/**
 * @file mofron-comp-form/index.js
 * @author simpart
 */
const mf      = require('mofron');
const Button  = require('mofron-comp-button');
const Message = require('mofron-comp-errmsg');
const Hrzpos  = require('mofron-effect-hrzpos');
const Synwid  = require('mofron-effect-syncwid');

mf.comp.Form = class extends mf.Component {
    /**
     * initialize form component
     *
     * @param p1 (object) component option
     * @param p1 (string) path to uri
     * @param p2 (component) form child component
     */
    constructor (po, p2) {
        try {
            super();
            this.name('Form');
            this.prmMap(['uri', 'child']);
            this.prmOpt(po, p2);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * initialize dom contents
     *
     * @note private method
     */
    initDomConts () {
        try {
            super.initDomConts();
            /* component contents */
            let conts = new mf.Component(this.message());
            let btn   = new mf.Component({
                effect : new Synwid(this),
                child  : this.submitConts()
            });
            this.child([ conts, btn ]);
            this.submitConts('Submit');

            this.target(conts.target());
            this.styleTgt(this.target());

            /* add enter key event */
            this.initKeyEvent();
            
            this.width('100%');
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * add enter key event
     *
     * @note private method
     */
    initKeyEvent () {
        try {
            if (undefined !== window.onkeyup) {
                let form = this;
                window.onkeyup = (e) => {
                    try {
                        let key      = e.keyCode ? e.keyCode : e.which;
                        let chd      = form.getItems();
                        let send_ret = null;
                        for (let cidx in chd) {
                            if ( (13 === key) &&
                                 (true === chd[cidx].focus()) ) {
                                form.send();
                                break;
                            }
                        }
                    } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                }
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * setter/getter callback function for send
     * 
     * @param p1 (function) send event function
     * @param p1 (undefined) call as getter
     * @param p2 (mix) event parameter
     * @return (array) send event array
     */
    callback (fnc, prm) {
        try {
            if ( (undefined !== fnc) && ('function' !== typeof fnc)) {
                throw new Error('invalid parameter');
            }
            return this.arrayMember(
                'callback', ['function', null],
                (undefined !== fnc) ? [fnc, prm] : undefined
            );
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * send event setter/getter
     * call function before send
     * 
     * @param p1 (function) send event function
     * @param p1 (undefined) call as getter
     * @param p2 (mix) event parameter
     * @return (array) send event array
     */
    sendEvent (fnc, prm) {
        try {
            if ( (undefined !== fnc) && ('function' !== typeof fnc)) {
                throw new Error('invalid parameter');
            }
            return this.arrayMember(
                'sendEvent', ['function', null],
                (undefined !== fnc) ? [fnc, prm] : undefined
            );
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * send post
     */
    send () {
        try {
           /* check item value */
           let ret_chk = this.checkValue();
           if (null !== ret_chk) {
               this.message(ret_chk.cause);
               return;
           }
           
           /* init sender */
           let xhr  = new XMLHttpRequest();
           let form = this;
           xhr.addEventListener(
               'load',
               function (evt) {
                   try {
                       mf.func.execFunc(
                           form.callback(),
                           new mf.Param(JSON.parse(this.response), form)
                       );
                   } catch (e) {
                       console.error(e.stack);
                       throw e;
                   }
               }
           );
           if (null === this.uri()) {
               throw new Error('could not find uri');
           }
           xhr.open('POST', this.uri());
           let send_val = this.getValue();
           let optprm   = this.optionParam();
           if (null !== optprm) {
               for (let oidx in optprm) {
                   send_val[oidx] = optprm[oidx];
               }
           }
           
           /* execute send event */
           mf.func.execFunc(this.sendEvent());
           
           /* send post */
           xhr.send(JSON.stringify(send_val));
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * setter/getter send uri
     *
     * @param p1 (string) send uri
     * @param p1 (undefined) call as getter
     * @return (string) send uri
     */
    uri (prm) {
        try { return this.member('uri', 'string', prm, null); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * check form item value
     */
    checkValue () {
        try {
            let items    = this.getItems();
            let ret_chk  = null;
            let form_idx = 0;
            
            for (let idx in items) {
                /* null check */
                ret_chk = items[idx].checkValue();
                if (null !== ret_chk) {
                    return {
                        index : idx,
                        cause : ret_chk
                    };
                }
            }
            /* reset message */
            this.message(null);
            return null;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * get form item value
     */
    getValue () {
        try {
            let ret_val = {};
            let items   = this.getItems();
            let val_nm  = null;
            /* get item value */
            for (var idx in items) {
                val_nm = items[idx].sendKey();
                ret_val[(null === val_nm) ? 'prm_' + idx : val_nm] = items[idx].value();
            }
            return ret_val;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * message component setter/getter
     *
     * @param p1 (Message) message component
     * @param p1 (string) message text
     * @param p1 (undefined) call as getter
     * @return (Message) message component
     */
    message (prm) {
        try {
            if (true === mf.func.isInclude(prm, 'Message')) {
                prm.execOption({
                    width   : '100%',
                    visible : false
                });
            } else if (null === prm) {
                this.message().execOption({
                    text    : "",
                    visible : false
                });
                return;
            } else if ('string' === typeof prm) {
                this.message().execOption({
                    text    : prm,
                    visible : true
                });
                return;
            }
            return this.innerComp('message', prm, Message);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * submit component setter/getter
     *
     * @param p1 (Button) submit component
     * @param p1 (undefined) call as getter
     * @return (Button) submit component
     */
    submitConts (prm) {
        try {
            if (true === mf.func.isInclude(prm, 'Button')) {
                let clk = (p1,p2,p3) => {
                    try { p2.send(); } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                };
                prm.execOption({
                    size       : [ '1.2rem', '0.27rem' ]    ,
                    effect     : new Hrzpos('center')      ,
                    clickEvent : [clk, this]
                });
            } else if ('string' === typeof prm) {
                this.submitConts().execOption({ text : prm });
                return;
            }
            return this.innerComp('submitConts', prm, Button);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * clear form items
     */
    clear () {
        try {
            let item = this.getItems();
            for (let iidx in item) {
                item[iidx].clear();
            }
            this.message(null);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * get form item list
     *
     * @return (array) form item list
     */
    getItems () {
        try {
            let ret = new Array();
            let chd = this.child();
            for (let cidx in chd) {
                if (true === mf.func.isInclude(chd[cidx], 'FormItem')) {
                    ret.push(chd[cidx]);
                }
            }
            return (0 === ret.length) ? [] : ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * extend post parameter setter/getter
     *
     * @param p1 (object) extend parameter
     * @param p1 (undefined) call as getter
     * @return (object) extend parameter
     */
    optionParam (prm) {
        try { return this.member('optionParam', 'object', prm); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
module.exports = mofron.comp.Form;
/* end of file */

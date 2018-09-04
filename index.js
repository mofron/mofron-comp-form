/**
 * @file mofron-comp-form/index.js
 * @author simpart
 */
const mf      = require('mofron');
const Button  = require('mofron-comp-button');
const Message = require('mofron-comp-message');
const HrzPos  = require('mofron-effect-hrzpos');

/**
 * @class Form
 * @brief form component for mofron
 */
mf.comp.Form = class extends mf.Component {
    constructor (po, p2) {
        try {
            super();
            this.name('Form');
            this.prmMap('uri', 'child');
            this.prmOpt(po, p2);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    initDomConts () {
        try {
            super.initDomConts();
            let conts  = new mf.Component({});
            let submit = new mf.Component({
                width : '100%'
            });
            
            this.child([ conts, submit ]);
            this.target(conts.target());
            this.child([this.message()]);
            
            this.submitTgt(submit.target());
            this.switchTgt(
                submit.target(),
                (p1) => {
                    try { p1.addChild(p1.submitComp()); } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                }
            );
            //this.initKeyEvent();
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    initKeyEvent () {
        try {
//            if (undefined !== window.onkeyup) {
//                let form = this;
//                window.onkeyup = (e) => {
//                    try {
//                        let key      = e.keyCode ? e.keyCode : e.which;
//                        let chd      = form.child();
//                        let send_ret = null;
//                        for (let cidx in chd) {
//                            if (true !== mf.func.isInclude(chd[cidx], 'Form')) {
//                                continue;
//                            }
//                            if ( (13 === key) &&
//                                 (true === chd[cidx].isFocused())) {
//                                send_ret = form.send();
//                                if (null !== send_ret) {
//                                    form.message(send_ret['cause']);
//                                }
//                                break;
//                            }
//                        }
//                    } catch (e) {
//                        console.error(e.stack);
//                        throw e;
//                    }
//                }
//            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    marginCenter (mgn, cnt) {
        try {
            let margin = this.getConfig('layout', 'Margin');
            let center = this.getConfig('layout', 'HrzCenter');
            if (undefined === mgn) {
                /* getter */
                return [
                    (null === margin) ? margin : margin.value(),
                    (null === center) ? center : center.rate()
                ];
            }
            /* setter */
            if (null !== margin) {
                margin.value(mgn);
            }
            if (null !== center) {
                center.rate(cnt);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    callback (fnc, prm) {
        try {
            if (undefined === fnc) {
                /* getter */
                return (undefined === this.m_callback) ? null : this.m_callback;
            }
            /* setter */
            if ('function' !== typeof fnc) {
                throw new Error('invalid parameter');
            }
            this.m_callback = [fnc, prm];
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    sendEvent (func, prm) {
        try {
            if (undefined === func) {
                /* getter */
                return (undefined === this.m_sendevt) ? [] : this.m_sendevt;
            }
            /* setter */
            if ('function' !== typeof func) {
                throw new Error('invalid parameter');
            }
            if (undefined === this.m_sendevt) {
                this.m_sendevt = new Array();
            }
            this.m_sendevt.push(new Array(func, (undefined === prm) ? null : prm));
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    send () {
        try {
            this.checkValue();
            if (true === this.message().visible()) {
                return;
            }
            if (null === this.uri()) {
                throw new Error('could not find uri');
            }
            
            let xhr  = new XMLHttpRequest();
            let form = this;
            xhr.addEventListener(
                'load',
                (event) => {
                    try {
                        if (null !== form.callback()) {
                            form.callback()[0](form, form.callback()[1]);
                        }
                    } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                }
            );
            
            xhr.open('POST', this.uri());
            let snd_evt = this.sendEvent();
            let ev_ret  = null;
            for (let eidx in snd_evt) {
                ev_ret = snd_evt[eidx][0](this, snd_evt[eidx][1]);
                if (null !== ev_ret) {
                    this.msgText(ev_ret);
                    return;
                }
            }
            
            xhr.send(JSON.stringify(this.value()));
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    uri (u) {
        try {
            if (undefined === u) {
                /* getter */
                return (undefined === this.m_uri) ? null : this.m_uri;
            }
            /* setter */
            if ('string' !== typeof u) {
                throw new Error('invalid parameter');
            }
            this.m_uri = u;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    checkValue () {
        try {
            let items = this.getItems();
            if (null === items) {
                this.msgText('internal error');
                return;
            }
            /* check form item value */
            let ret_chk = null;
            for (let idx in items) {
                ret_chk = items[idx].checkValue();
                if (null !== ret_chk) {
                    this.msgText(ret_chk);
                    return;
                }
            }
            /* reset message */
            this.msgText(null);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    value () {
        try {
            let ret_val = {};
            let items   = this.getItems();
            let val_nm  = null;
            if (null === items) {
                return null;
            }
            /* get item value */
            for (var idx in items) {
                val_nm = items[idx].sendKey();
                ret_val[(null === val_nm)? 'prm_' + idx : val_nm] = items[idx].value();
            }
            /* get option param */
            let optprm = this.optionParam();
            for (let oidx in optprm) {
                ret_val[oidx] = optprm[oidx];
            }
            return ret_val;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    message (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                if (undefined === this.m_message) {
                    this.message(
                        new Message({
                            effect  : [ new HrzPos('center') ],
                            width   : '70%',
                            text    : '',
                            color   : new mf.Color(200,60,60),
                            visible : false
                        })
                    );
                }
                return this.m_message;
            }
            /* setter */
            if (true !== mf.func.isInclude(prm, 'Message')) {
                throw new Error('invalid parameter');
            }
            this.m_message = prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    msgText (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                return this.message().text();
            }
            /* setter */
            if (null === prm) {
                this.message().visible(false);
            } else if ('string' === typeof prm) {
                this.message().visible(true);
                this.message().text(prm);
            } else {
                throw new Error('invalid parameter');
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    msgEvent (fnc, prm) {
        try {
            if (undefined === fnc) {
                /* getter */
                return (undefined === this.m_msg_evt) ? [null, null] : this.m_msg_evt;
            }
            /* setter */
            if ('function' !== typeof fnc) {
                throw new Error('invalid paramter');
            }
            this.m_msg_evt = new Array(fnc, prm);
        } catch (e) {
            console.error(e.stack);
            throw e;          
        }
    }
    
    submitTgt (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                return (undefined === this.m_sbmtgt) ? null : this.m_sbmtgt;
            }
            /* setter */
            if (true !== mf.func.isInclude(prm, 'Dom')) {
                throw new Error('invalid paramter');
            }
            this.m_sbmtgt = prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    submitComp (prm) {
        try {
            if (undefined === prm) {
                /* getter */
                if (undefined === this.m_submit) {
                    this.submitComp(
                        new Button({
                            effect     : [ new HrzPos('center') ],
                            text       : 'Send',
                            size       : new mf.Param('1rem', '0.3rem'),
                            sizeValue  : new mf.Param('margin-top', '0.1rem'),
                            clickEvent : new mf.Param(
                                (sub, form) => {
                                    try { form.send(); } catch (e) {
                                        console.error(e.stack);
                                        throw e;
                                    } 
                                },
                                this
                            )
                        })
                    );
                }
                return this.m_submit;
            }
            /* setter */
            if (true !== mf.func.isInclude(prm, 'Component')) {
                throw new Error('invalid parameter');
            }
            this.m_submit = prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    width (prm) {
        try {
            let ret = super.width(prm);
            if (undefined === ret) {
                this.adom().child()[0].style({
                    width : prm
                });
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
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
    
    getItems () {
        try {
            let ret = new Array();
            let chd = this.child();
            for (let cidx in chd) {
                if (true === mf.func.isInclude(chd[cidx], 'FormItem')) {
                    ret.push(chd[cidx]);
                }
            }
            return (0 === ret.length) ? null : ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    optionParam (prm) {
        if (undefined === prm) {
            /* getter */
            return (undefined === this.m_optprm) ? [] : this.m_optprm;
        }
        if ('object' !== typeof prm) {
            throw new Error('invalid parameter');
        }
        this.m_optprm = prm;
    }
}
module.exports = mf.comp.Form;
/* end of file */

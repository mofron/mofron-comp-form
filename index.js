/**
 * @file mofron-comp-form/index.js
 * @author simpart
 */
let mf = require('mofron');
let Button = require('mofron-comp-button');
let Message = require('mofron-comp-message');
let Margin  = require('mofron-layout-margin');
let Center  = require('mofron-layout-hrzcenter');

/**
 * @class Form
 * @brief form component for mofron
 */
mf.comp.Form = class extends mf.Component {
    constructor (po) {
        try {
            super();
            this.name('Form');
            this.prmOpt(po);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    initDomConts (mgn, cnt) {
        try {
            super.initDomConts();
            this.target().style({ 'width' : '100%' });
            
            this.layout([
                new Margin('top', (undefined === mgn) ? 25 : mgn),
                new Center({ rate : (undefined === cnt) ? 70 : cnt })
            ]);
            
            super.addChild(this.message(), false);
            let sub = this.submitComp();
            super.addChild(sub.parent().parent());
            
            this.initKeyEvent();
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    initKeyEvent () {
        try {
            if (undefined !== window.onkeyup) {
                let form = this;
                window.onkeyup = (e) => {
                    try {
                        let key      = e.keyCode ? e.keyCode : e.which;
                        let chd      = form.child();
                        let send_ret = null;
                        for (let cidx in chd) {
                            if (true !== mf.func.isInclude(chd[cidx], 'Form')) {
                                continue;
                            }
                            if ( (13 === key) &&
                                 (true === chd[cidx].isFocused())) {
                                send_ret = form.send();
                                if (null !== send_ret) {
                                    form.message(send_ret['cause']);
                                }
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
            console.log(e.stack);
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
    
    callback (func, prm) {
        try {
            if (undefined === func) {
                /* getter */
                return (undefined === this.m_callback) ? new Array(null,null) : this.m_callback;
            }
            /* setter */
            if ('function' !== typeof func) {
                throw new Error('invalid parameter');
            }
            if (undefined === this.m_callback) {
                this.m_callback = new Array(null,null);
            }
            this.m_callback[0] = func;
            this.m_callback[1] = (undefined === prm) ? null : prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    sendEvent (func, prm) {
        try {
            if (undefined === func) {
                /* getter */
                return (undefined === this.m_sendevt) ? new Array(null,null) : this.m_sendevt;
            }
            /* setter */
            if ('function' !== typeof func) {
                throw new Error('invalid parameter');
            }
            if (undefined === this.m_sendevt) {
                this.m_sendevt = new Array(null,null);
            }
            this.m_sendevt[0] = func;
            this.m_sendevt[1] = (undefined === prm) ? null : prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    send () {
        try {
           if (0 === this.child().length) {
               return {
                   index : -1,
                   cause : 'form is no element'
               };
           }
           var ret_chk = this.checkValue();
           if (null !== ret_chk) {
               return ret_chk;
           }
           
           var cb   = this.callback();
           var xhr  = new XMLHttpRequest();
           let form = this;
           xhr.addEventListener('load', function(event) {
               if (null != cb[0]) {
                   cb[0](JSON.parse(this.response), form, cb[1]);
               }
           });
           var send_uri = (undefined === this.uri()) ? this.m_param : this.uri();
           if (null === send_uri) {
               throw new Error('invalid parameter');
           }
           xhr.open('POST', send_uri);
           let send_val = this.value();
           
           if (null !== this.sendEvent()[0]) {
               let ev_ret = this.sendEvent()[0](this, this.sendEvent()[1]);
               if (null !== ev_ret) {
                   return {
                       index : -1,
                       cause : ev_ret
                   };
               }
           }
           xhr.send(JSON.stringify(send_val));
           return null;
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
            this.message(null);
            var chd      = this.child();
            var ret_chk  = null;
            var form_idx = 0;
            for (var idx in chd) {
                if (true !== mf.func.isInclude(chd[idx], 'FormItem')) {
                    continue;
                }
                
                /* null check */
                if ( (true === chd[idx].require()) &&
                     ( (null      === chd[idx].value()) ||
                       (undefined === chd[idx].value()) ) ) {
                    return {
                        index : form_idx,
                        cause : 'emply value'
                    }
                }
                ret_chk = chd[idx].checkValue();
                if (null !== ret_chk) {
                    return {
                        index : form_idx,
                        cause : ret_chk
                    }
                }
                
                form_idx++;
            }
            return null;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    value () {
        try {
            let ret_val = {};
            let chd     = this.child();
            let val_nm  = null;
            for (var idx in chd) {
                if (true !== mf.func.isInclude(chd[idx], 'FormItem')) {
                    continue;
                }
                val_nm = chd[idx].sendKey();
                if (null === val_nm) {
                    val_nm = 'prm_' + idx;
                }
                ret_val[val_nm] = chd[idx].value();
            }
            return ret_val;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    message (msg) {
        try {
            if (undefined === msg) {
                /* getter */
                if (undefined === this.m_message) {
                    this.message(
                        new Message({
                            text    : '',
                            color   : new mf.Color(200,60,60),
                            visible : false
                        })
                    );
                }
                return this.m_message;
            }
            /* setter */
            if (true === mf.func.isInclude(msg, 'Message')) {
                this.m_message = msg;
            } else if ('string' === typeof msg) {
                this.message().text(msg);
                this.message().visible(true);
                let mevt = this.msgEvent();
                if (null !== mevt[0]) {
                    mevt[0](msg, mevt[1]);
                }
            } else if (null === msg) {
                this.message().visible(false);
                let mevt = this.msgEvent();
                if (null !== mevt[0]) {
                    mevt[0](msg, mevt[1]);
                }               
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
    
    submitComp (sub) {
        try {
            if (undefined === sub) {
                /* getter */
                if (undefined === this.m_submit) {
                    this.submitComp(
                        new Button({
                            text  : 'Send',
                            size  : new mf.Param(100, 30)
                        })
                    );
                }
                return this.m_submit;
            }
            /* setter */
            let clk_fnc = (tgt, frm) => {
                try {
                    let ret = frm.send();
                    if (null !== ret) {
                        frm.message(ret['cause']);
                    }
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            };
            if (true === mf.func.isInclude(sub, 'Button')) {
                if (undefined !== this.m_submit) {
                    sub.color(this.m_submit.color());
                    sub.size(this.m_submit.size()[0], this.m_submit.size()[1]);
                    sub.clickEvent(clk_fnc, this);
                    this.m_submit.parent().updChild(this.m_submit, sub);
                    return;
                }
                let sub_wid = ('number' === typeof sub.width()) ? sub.width()+'px' : sub.width();
                new mf.Component({
                    addChild : new mf.Component({
                        addChild : sub,
                        style    : {
                            'position'    : 'relative',
                            'margin-left' : '100%'    ,
                            'left'        : '-' + sub_wid
                        }
                    })
                });
                sub.width((null === sub.width()) ? 100 : undefined);
                sub.clickEvent(clk_fnc, this);
                this.m_submit = sub;
            } else if ('string' === typeof sub) {
                this.submitComp().text(sub);
            } else {
                throw new Error('invalid parameter');
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    addChild (chd, idx, flg) {
        try {
            if (false !== flg) {
                super.addChild(chd, (undefined === idx) ? this.child().length-1 : idx);
            } else {
                super.addChild(chd, idx);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    width (prm) {
        try {
            let hcnt = this.getConfig('layout', 'HrzCenter');
            if (undefined === prm) {
                /* getter */
                if (null === hcnt) {
                    return null;
                }
                return hcnt.rate() + '%';
            }
            /* setter */
            if (null === hcnt) {
                let chd = this.child();
                for (let cidx in chd) {
                    if (true === mf.func.isInclude(chd[cidx], 'Form')) {
                        chd[cidx].width(prm);
                    }
                }
            } else {
                hcnt.rate(prm);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    height (prm) {
        try {
            let mrg = this.getConfig('layout', 'Margin');
            let chd = this.child();
            if (undefined === prm) {
                /* getter */
                let hret = 0;
                let mval = (null === mrg) ? 0 : mrg.value();
                for (let cidx in chd) {
                    if ( (true === mf.func.isInclude(chd[cidx], 'Message')) &&
                         (false === chd[cidx].visible())) {
                        continue;
                    }
                    if (parseInt(cidx)+1 == chd.length) {
                        hret += this.submitComp().height();
                    } else {
                        hret += ('number' === typeof (chd[cidx].height())) ? chd[cidx].height() : 0;
                    }
                    hret += mval;
                }
                return hret;
            }
            /* setter */
            if (null === mrg) {
                if ('number' !== typeof prm) {
                    throw new Error('invalid paramter');
                }
                let chei = prm / (0 === chd.length) ? 1 : chd.length;
                for (let cidx in chd) {
                    chd[cidx].height(chei);
                }
            } else {
                mrg.value(prm);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
module.exports = mofron.comp.Form;
/* end of file */

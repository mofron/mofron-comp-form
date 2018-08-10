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
    constructor (po, p2) {
        try {
            super();
            this.name('Form');
            this.sizeType('rem');
            this.prmMap('uri', 'child');
            this.prmOpt(po, p2);
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
                new Margin('top', (undefined === mgn) ? 0.25 : mgn),
                new Center((undefined === cnt) ? 70 : cnt)
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
                return (undefined === this.m_sendevt) ? null : this.m_sendevt;
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
           let ret_chk = this.checkValue();
           if (null !== ret_chk) {
               return ret_chk;
           }
           
           let cb   = this.callback();
           let xhr  = new XMLHttpRequest();
           let form = this;
           xhr.addEventListener('load', function(event) {
               if (null != cb) {
                   let cb_ret = null;
                   for (let cidx in cb) {
                       cb_ret = cb[cidx][0](JSON.parse(this.response), form, cb[cidx][1]);
                       if (null !== cb_ret) {
                           form.message(cb_ret);
                       }
                   }
               }
           });
           var send_uri = (undefined === this.uri()) ? this.m_param : this.uri();
           if (null === send_uri) {
               throw new Error('could not find uri');
           }
           xhr.open('POST', send_uri);
           let send_val = this.value();
           let optprm = this.optionParam();
           if (null !== optprm) {
               for (let oidx in optprm) {
                   send_val[oidx] = optprm[oidx];
               }
           }
           
           let snd_evt = this.sendEvent();
           if (null !== snd_evt) {
               let ev_ret = null;
               for (let eidx in snd_evt) {
                   ev_ret = snd_evt[eidx][0](this, snd_evt[eidx][1]);
                   if (null !== ev_ret) {
                       return {
                           index : -1,
                           cause : ev_ret
                       };
                   }
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
            let items    = this.getItems();
            let ret_chk  = null;
            let form_idx = 0;
            if (null === items) {
               return {
                   index : -1,
                   cause : 'form is no element'
               };
            }
            for (let idx in items) {
                /* null check */
                ret_chk = items[idx].checkValue();
                if (null !== ret_chk) {
                    return {
                        index : idx,
                        cause : ret_chk
                    }
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
                this.message().execOption({
                    text    : msg,
                    visible : true
                });
                let mevt = this.msgEvent();
                if (null !== mevt[0]) {
                    mevt[0](msg, mevt[1]);
                }
            } else if (null === msg) {
                this.message().execOption({ 
                    visible : true
                });
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
                            size  : new mf.Param(1, 0.3)
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
                new mf.Component({
                    addChild : new mf.Component({
                        addChild : sub,
                        style    : {
                            'position'    : 'relative',
                            'margin-left' : '100%'    ,
                            'left'        : '-' + sub.width()
                        }
                    })
                });
                sub.width((null === sub.width()) ? 1 : undefined);
                sub.clickEvent(clk_fnc, this);
                this.m_submit = sub;
            } else if ('string' === typeof sub) {
                this.submitComp().execOption({
                    text : sub
                });
            } else {
                throw new Error('invalid parameter');
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    submitText (prm) {
        if (undefined === prm) {
            /* getter */
            return this.submitComp().text();
        }
        /* setter */
        this.submitComp().execOption({
            text : prm
        });
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
                        hret = mf.func.sizeSum(hret, this.submitComp().height());
                    } else {
                        hret = mf.func.sizeSum(
                            hret,
                            chd[cidx].height(),
                            (true === mf.func.isInclude(chd[cidx], 'Input')) ? 0.15 : 0
                        );
                    }
                    hret = mf.func.sizeSum(hret, mval);
                }
                hret = mf.func.sizeSum(hret, mval);
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
            return (undefined === this.m_optprm) ? null : this.m_optprm;
        }
        if ('object' !== typeof prm) {
            throw new Error('invalid parameter');
        }
        this.m_optprm = prm;
    }
}
module.exports = mofron.comp.Form;
/* end of file */

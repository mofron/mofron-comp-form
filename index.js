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
            
            this.layout([
                new Margin('top', (undefined === mgn) ? 25 : mgn),
                new Center({ rate : (undefined === cnt) ? 70 : cnt })
            ]);
            
            super.addChild(this.message(), false);
            let sub = this.submitComp();
            super.addChild(sub.parent().parent());
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
    
    send (url) {
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
                if (true !== mf.func.isInclude(chd[idx], 'Form')) {
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
                if (true !== mf.func.isInclude(chd[idx], 'Form')) {
                    continue;
                }
                val_nm = chd[idx].setKey();
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
    
    setKey (nm) {
        try {
            if (undefined === nm) {
                /* getter */
                return (undefined === this.m_form_key) ? null : this.m_form_key;
            }
            /* setter */
            if ('string' !== typeof nm) {
                throw new Error('invalid parameter');
            }
            this.m_form_key = nm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    require (flg) {
        try {
            if (undefined === flg) {
                /* getter */
                return (undefined === this.m_req) ? false : this.m_req;
            }
            /* setter */
            if ('boolean' !== typeof flg) {
                throw new Error('invalid parameter');
            }
            this.m_req = flg;
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
                this.message().visible(('' === msg) ? false : true);
            } else if (null === msg) {
                this.message().visible(false);
            } else {
                throw new Error('invalid parameter');
            }
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
                    this.submitComp(new Button('Send'));
                }
                return this.m_submit;
            }
            /* setter */
            if (true === mf.func.isInclude(sub, 'Button')) {
                if (undefined !== this.m_submit) {
                    sub.color(this.m_submit.color());
                    sub.size(this.m_submit.size()[0], this.m_submit.size()[1]);
                    this.m_submit.parent().updChild(this.m_submit, sub);
                    return;
                }
                new mf.Component({
                    addChild : new mf.Component({
                        addChild : sub,
                        style    : {
                            width  : (null === sub.width()) ? '100px' : sub.width() + 'px',
                                         'margin-left' : 'auto'
                        }
                    })
                });
                sub.width((null === sub.width()) ? 100 : undefined);
                sub.clickEvent(
                    (tgt, frm) => {
                        try {
                            var ret = frm.send();
                            if (null !== ret) {
                                frm.message(ret['cause']);
                            }
                        } catch (e) {
                            console.error(e.stack);
                            throw e;
                        }
                    },
                    this
                );
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
}
module.exports   = mofron.comp.Form;
/* end of file */

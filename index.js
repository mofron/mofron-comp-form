/**
 * @file mofron-comp-form/index.js
 * @author simpart
 */
let Button = require('mofron-comp-button');
let Message = require('mofron-comp-message');
let Margin  = require('mofron-layout-margin');
let Center  = require('mofron-layout-hrzcenter');

/**
 * @class Form
 * @brief form component for mofron
 */
mofron.comp.Form = class extends mofron.Component {
    
    constructor (opt) {
        try {
            super();
            this.name('Form');
            this.m_setmsg = false;
            this.m_setbtn = false;
            this.prmOpt(opt);
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
           
           /* check hash function */
           //let hash_fnc = this.hash();
           //if (null !== hash_fnc) {
           //    let upd_key,upd_val;
           //    for (let vidx in send_val) {
           //        upd_key = hash_fnc(vidx);
           //        upd_val = hash_fnc(send_val[vidx]);
           //        send_val[upd_key] = upd_val;
           //    }
           //}
           
           xhr.send(JSON.stringify(send_val));
           return null;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    //hash (func) {
    //    try {
    //        if (undefined === func) {
    //            /* getter */
    //            return (undefined === this.m_hash) ? null : this.m_hash;
    //        }
    //        /* setter */
    //        if ('function' !== typeof tp) {
    //            throw new Error('invalid parameter');
    //        }
    //        this.m_hash = func;
    //    } catch (e) {
    //        console.error(e.stack);
    //        throw e;
    //    }
    //}
    
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
                if (true !== mofron.func.isInclude(chd[idx], 'Form')) {
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
                if (true !== mofron.func.isInclude(chd[idx], 'Form')) {
                    continue;
                }
                val_nm = chd[idx].valueName();
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
    
    valueName (nm) {
        try {
            if (undefined === nm) {
                /* getter */
                return (undefined === this.m_valname) ? null : this.m_valname;
            }
            /* setter */
            if ('string' !== typeof nm) {
                throw new Error('invalid parameter');
            }
            this.m_valname = nm;
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
                            color   : new mofron.Color(200,60,60),
                            visible : false
                        })
                    );
                }
                return this.m_message;
            }
            /* setter */
            if (true === mofron.func.isInclude(msg, 'Message')) {
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
            if (true === mofron.func.isInclude(sub, 'Button')) {
                new mofron.Component({
                    addChild : new mofron.Component({
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
    
    addChild (chd, idx) {
        try {
            if (true === mofron.func.isObject(this, 'Form')) {
                this.initFormComp();
            }
            super.addChild(chd, (undefined === idx) ? this.child().length-1 : idx);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    initFormComp () {
        try {
            if (0 === this.layout().length) {
                /* set default layout */
                this.layout([
                    new Margin('top', 25),
                    new Center({ rate : 70 })
                ]);
            }
            
            if (false === this.m_setmsg) {
                this.m_setmsg = true;
                super.addChild(this.message(), false);
            }
            
            if (false === this.m_setbtn) {
                this.m_setbtn = true;
                let sub       = this.submitComp();
                super.addChild(sub.parent().parent());
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
mofron.comp.form = {};
module.exports   = mofron.comp.Form;

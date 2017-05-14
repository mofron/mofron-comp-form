/**
 * @file mofron-comp-form/index.js
 * @author simpart
 */
require('mofron-comp-button');
require('mofron-layout-margin');
require('mofron-layout-hrzcenter');

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
    
    callback (cb_func, cb_prm) {
        try {
            if (undefined === cb_func) {
                /* getter */
                return (undefined === this.m_callback) ? new Array(null,null) : this.m_callback;
            }
            /* setter */
            if ('function' !== typeof cb_func) {
                throw new Error('invalid parameter');
            }
            if (undefined === this.m_callback) {
                this.m_callback = new Array(null,null);
            }
            this.m_callback[0] = cb_func;
            this.m_callback[1] = (undefined === cb_prm) ? null : cb_prm;
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
           
           var cb  = this.callback();
           var xhr = new XMLHttpRequest();
           xhr.addEventListener('load', function(event) {
               if (null != cb[0]) {
                   cb[0](JSON.parse(this.response), cb[1]);
               }
           });
           
           var send_uri = (undefined === this.uri()) ? this.m_param : this.uri();
           if (null === send_uri) {
               throw new Error('invalid parameter');
           }
           xhr.open('POST', send_uri);
           xhr.send(JSON.stringify(this.value()));
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
            this.message('&nbsp;');
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
            var ret_val = new Array();
            var chd     = this.child();
            for (var idx in chd) {
                if (true !== mofron.func.isInclude(chd[idx], 'Form')) {
                    continue;
                }
                ret_val.push(chd[idx].value());
            }
            return ret_val;
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
                    var set_msg = this.theme().component('mofron-comp-text');
                    this.message(
                        new set_msg({
                            text  : '&nbsp;'
                        })
                    );
                }
                return this.m_message;
            }
            /* setter */
            if (true === mofron.func.isInclude(msg, 'Text')) {
                msg.color(new mofron.Color(255,0,0));
                this.m_message = msg;
            } else if ('string' === typeof msg) {
                this.message().text(msg);
            } else {
                throw new Error('invalid parameter');
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    button (btn_str) {
        try {
            if (undefined === btn_str) {
                /* getter */
                if (undefined === this.m_button) {
                    var Btn = this.theme().component('mofron-comp-button');
                    this.button(new Btn('Send'));
                }
                return this.m_button;
            }
            /* setter */
            if (true === mofron.func.isInclude(btn_str, 'Button')) {
                var wrp = new mofron.Component({
                              addChild : btn_str,
                              style    : {
                                             width    : (null === btn_str.width()) ? '100px' : btn_str.width() + 'px',
                                             'margin-left' : 'auto'
                                         }
                          });
                btn_str.width((null === btn_str.width()) ? 100 : undefined);
                btn_str.clickEvent(
                    function (frm) {
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
                this.m_button = btn_str;
            } else if ('string' === typeof btn_str) {
                this.button().text(btn_str);
            } else {
                throw new Error('invalid parameter');
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    addChild (chd, disp, idx) {
        try {
            if (true === mofron.func.isObject(this, 'Form')) {
                if (0 === this.layout().length) {
                    /* set default layout */
                    this.layout([
                        new mofron.layout.Margin('top', 25),
                        new mofron.layout.HrzCenter({
                            type : 'padding',
                            rate : 70
                        })
                    ]);
                }
            
                if (false === this.m_setmsg) {
                    this.m_setmsg = true;
                    super.addChild(this.message());
                }
                
                if (false === this.m_setbtn) {
                    this.m_setbtn = true;
                    super.addChild(
                        new mofron.Component({
                            addChild : this.button().parent(),
                        })
                    );
                }
            }
            super.addChild(chd, disp, (undefined === idx) ? this.child().length-1 : idx);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
mofron.comp.form = {};
module.exports   = mofron.comp.Form;

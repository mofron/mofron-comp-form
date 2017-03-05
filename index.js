/**
 * @file mofron-comp-form/index.js
 * @author simpart
 */

/**
 * @class Form
 */
mofron.comp.Form = class extends mofron.Component {
    /**
     * initialize form component
     * 
     * @param prm_opt (string) send uri
     * @param prm_opt (object) option object of key-value
     */
    constructor (prm_opt) {
        try {
            super();
            this.name('Form');
            
            this.m_callback = new Array(null,null);
            this.m_req      = false;
            
            this.prmOpt(prm_opt);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    initDomConts (prm) {
        try {
            super.initDomConts();
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    callback (cb_func, cb_prm) {
        try {
            if (undefined === cb_func) {
                /* getter */
                return this.m_callback;
            }
            /* setter */
            if ('function' !== typeof cb_func) {
                throw new Error('invalid parameter');
            }
            var prm = (undefined === cb_prm) ? null : cb_prm;
            this.m_callback[0] = cb_func;
            this.m_callback[1] = prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    send () {
        try {
           if (0 === this.child().length) {
               throw new Error('there is no element');
           }
           var ret_chk = this.checkValue();
           if (null !== ret_chk) {
               throw new Error(ret_chk.check + ' at index ' + ret_chk.index);
           }
           
           var cb = this.callback();
           var xhr = new XMLHttpRequest();
           xhr.addEventListener('load', function(event) {
               if (null != cb[0]) {
                   cb[0](JSON.parse(this.response), cb[1]);
               }
           });
           xhr.open('POST', this.m_param);
           xhr.send(JSON.stringify(this.value()));
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    checkValue () {
        try {
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
                        check : "emply value"
                    }
                }
                ret_chk = chd[idx].checkValue();
                if (null !== ret_chk) {
                    return {
                        index  : form_idx,
                        check  : ret_chk
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
                return this.m_req;
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
}
module.exports = mofron.comp.Form;

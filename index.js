/**
 * @file mofron-comp-form/index.js
 * @brief form component for mofron
 * @feature send POST when submit component is clicked.
 *          check automatically form item values.
 *          show an error message if form item check is false.
 * @attention form component child must be a formitem component.
 * @author simpart
 */
const mf      = require("mofron");
const Button  = require("mofron-comp-button");
const Message = require("mofron-comp-errmsg");
const Hrzpos  = require("mofron-effect-hrzpos");
const Synwid  = require("mofron-effect-syncwid");
const Margin  = require('mofron-layout-margin');

mf.comp.Form = class extends mf.Component {
    /**
     * initialize form component
     * 
     * @param (mixed) string: uri parameter
     *                object: component option
     * @param (component) child parameter
     * @type private
     */
    constructor (po, p2) {
        try {
            super();
            this.name("Form");
            this.prmMap(["uri", "child"]);
            this.prmOpt(po, p2);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * initialize dom contents
     *
     * @type private
     */
    initDomConts () {
        try {
            super.initDomConts();
            this.layout(
	        new Margin({ type:"top", value: "0rem", tag: "Form" })
	    );
            
            /* component contents */
            let conts = new mf.Component(this.message());
            this.child([
                conts,
                new mf.Component({
                    effect: new Synwid(this), child: this.submitConts()
                })
            ]);
            this.submitConts(new Button("Submit"));
            
            this.target(conts.target());
            
            /* add enter key event */
            this.initKeyEvent();
            this.width("100%");
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * margin top layout config
     * 
     * @param (string (size)) margin top size
     * @return (string) margin top size
     * @type parameter
     */
    marginTop (prm) {
        try {
	    let mgn = this.layout(["Margin", "Form"]);
	    let ret = mgn.value(prm);
	    if (undefined !== prm) {
                this.submitConts().style({ "margin-top": prm });
	    }
	    return ret;
	} catch (e) {
	    console.error(e.stack);
	    throw e;
        }
    }

    /**
     * add enter key event
     *
     * @type private
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
     * event function for after sending
     * 
     * @param (function) send event function
     * @param (mix) event parameter
     * @return (array) send event array
     * @type parameter
     */
    callback (fnc, prm) {
        try {
            if ( (undefined !== fnc) && ("function" !== typeof fnc)) {
                throw new Error("invalid parameter");
            }
            return this.arrayMember(
                "callback",
                "object",
                (undefined !== fnc) ? [fnc, prm] : undefined
            );
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * event function for before send
     * 
     * @param (function) send event function
     * @param (mix) event parameter
     * @return (array) send event array
     * @type parameter
     */
    sendEvent (fnc, prm) {
        try {
            if ( (undefined !== fnc) && ("function" !== typeof fnc)) {
                throw new Error("invalid parameter");
            }
            return this.arrayMember(
                "sendEvent",
                "object",
                (undefined !== fnc) ? [fnc, prm] : undefined
            );
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * send post
     *
     * @type private
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
                       let cbs = form.callback();
                       for (let cidx in cbs) {
                           cbs[cidx][0](form, JSON.parse(this.response), cbs[cidx][1]);
                       }
                   } catch (e) {
                       console.error(e.stack);
                       throw e;
                   }
               }
           );
           
           /* execute send event */
           let sev = this.sendEvent();
           for (let sev_idx in sev) {
               sev[sev_idx][0](this, this.getValue(), sev[sev_idx][1]);
           }
           
           if (null === this.uri()) {
               console.warn("could not find send uri");
               return;
           }
           xhr.open('POST', this.uri());
           let send_val = this.getValue();
           let optprm   = this.optionParam();
           if (null !== optprm) {
               for (let oidx in optprm) {
                   send_val[oidx] = optprm[oidx];
               }
           }
           
           /* send post */
           xhr.send(JSON.stringify(send_val));
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * send uri
     * 
     * @param (string) send uri
     * @return (string) send uri
     * @type parameter
     */
    uri (prm) {
        try { return this.member("uri", "string", prm, null); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * check form item value
     * 
     * @type private
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
     * 
     * @type funtion
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
     * message component
     * 
     * @param (mixed) text/mofron-comp-text: message contents
     *                mofron-comp-message: replace message component
     * @return (mofron-comp-message) message component
     * @type function
     */
    message (prm) {
        try {
            if (true === mf.func.isInclude(prm, 'Message')) {
                prm.option({ width: '100%', visible: false });
            } else if (null === prm) {
                this.message().option({ text: "", visible: false });
                return;
            } else if ("string" === typeof prm) {
                this.message().option({ text: prm, visible: true });
                return;
            }
            return this.innerComp("message", prm, Message);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * submit component
     * 
     * @param (mixed) string: submit text contents
     *                component: submit component
     * @return (component) submit component
     * @type parameter
     */
    submitConts (prm) {
        try {
            if (true === mf.func.isComp(prm)) {
                let clk = (p1,p2,p3) => {
                    try { p3.send(); } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                };
                prm.option({
                    size: ["1.2rem","0.27rem"], effect: new Hrzpos("center"),
		    style: { "margin-top" : "0.3rem" },
                    clickEvent: [clk, this]
                });
            } else if ("string" === typeof prm) {
                this.submitConts().option({ text : prm });
                return;
            }
            return this.innerComp("submitConts", prm, mf.Component);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * clear form items
     *
     * @type function
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
     * @type private
     */
    getItems () {
        try {
            let ret = new Array();
            let chd = this.child();
            for (let cidx in chd) {
                if (true === mf.func.isInclude(chd[cidx], "FormItem")) {
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
     * @param (object) extend parameter
     * @return (object) extend parameter
     * @type parameter
     */
    optionParam (prm) {
        try { return this.member('optionParam', 'object', prm); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * form height setter/getter
     * 
     * @param (string (size)) form height
     * @param (option) style option
     * @return (string (size)) form height
     * @type parameter
     */
    height (prm, opt) {
        try {
	    if (undefined === prm) {
                let ret = "0rem";
                /* add message height */
                if (true === this.message().visible()) {
                    ret = mf.func.sizeSum(ret, this.message().height(), this.marginTop());
                }
                let chd = this.child();
                if (true === mf.func.isInclude(chd[0],"Message")) {
                    chd.splice(0, 1);
                }
                /* add formitem height */
                for (let cidx in chd) {
                    ret = mf.func.sizeSum(ret, chd[cidx].height(), this.marginTop());
                }
                /* add submit height */
	        return mf.func.sizeSum(ret, this.submitConts().height(), this.marginTop());
	    }
	    /* setter */
            super.height(prm, opt);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
module.exports = mofron.comp.Form;
/* end of file */

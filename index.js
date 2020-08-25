/**
 * @file mofron-comp-form/index.js
 * @brief form component for mofron
 * @feature send POST when submit component is clicked.
 *          check automatically form item values.
 *          show an error message if form item check is false.
 * @attention form component child must be a formitem component.
 * @license MIT
 */
const Button  = require("mofron-comp-button");
const Message = require("mofron-comp-errmsg");
const Hrzpos  = require("mofron-effect-hrzpos");
const Synwid  = require("mofron-effect-syncwid");
const Margin  = require("mofron-layout-margin");
const Click   = require("mofron-event-click");
const Key     = require("mofron-event-key");
const comutl = mofron.util.common;

module.exports = class extends mofron.class.Component {
    /**
     * initialize form component
     * 
     * @param (mixed) string: uri parameter
     *                key-value: component config
     * @param (component) child parameter
     * @type private
     */
    constructor (prm) {
        try {
            super();
            this.modname("Form");
            /* init config */
	    this.confmng().add("enterSend", { type: "boolean", init: false });
	    this.confmng().add("callback", { type: "event", list: true });
            this.confmng().add("sendEvent", { type: "event", list: true });
            this.confmng().add("uri", { type: "string" });
            this.confmng().add('extParam', { type: "key-value" });
	    this.confmng().add("sendfunc", { type: "event" });
	    /* set config */
	    if (undefined !== prm) {
                this.config(prm);
	    }
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
            
            /* component contents */
            let conts = new mofron.class.Component(this.message());
            this.child([
                conts,
                new mofron.class.Component({
                    effect: new Synwid(this), child: this.submitComp()
                })
            ]);
            this.submitComp(new Button("Submit"));
            this.childDom(conts.childDom());
            
            /* add enter key event */
            this.initKeyEvent();
            this.width("100%");
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * get child heights
     * 
     * @return (string) child heights
     * @type function
     */
    getChildHeight () {
        try {
	    let ret = null;
            let chd = this.child();
	    for (let cidx in chd) {
	        if (null === ret) {
                    ret = chd[cidx].height();
		    continue;
		}
	        try {
		    ret = comutl.sizesum(ret, chd[cidx].height());
		} catch (e) {
		    console.warn("failed "+ chd[cidx].neme() +" height sum:" + chd[cidx].height());
		}
	    }
	    ret = comutl.sizesum(ret, this.submitComp().height());
	    ret = comutl.sizesum(ret, this.submitComp().style("margin-top"));
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
	    let fnc = (f1,f2,f3) => {
                try {
		    if (("Enter" !== f2) || (false === f3.enterSend())) {
                        return;
		    }
		    let itm = f3.getItems();
		    for (let iidx in itm) {
                        if (true === itm[iidx].focus()) {
			    f3.send();
                            return;
			}
		    }
		} catch (e) {
                    console.error(e.stack);
                    throw e;
		}
	    }
	    mofron.window.event(
		new Key(new ConfArg(fnc,this), "Enter"))
            );
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * enter send flag setter/getter
     * 
     * @param (boolean) true: send form data when user press enter
     *                  false: not send (default)
     * @return (boolean) enter send flag
     * @type parameter
     */
    enterSend (prm) {
        try {
            return this.confmng("enterSend", prm);
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
	    return this.confmng("callback", fnc, prm);
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
	    return this.confmng("sendEvent", fnc, prm);
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
	   if (null !== this.sendfunc()) {
	       let sfnc = this.sendfunc();
	       sfnc[0](sfnc[1]);
               return;
	   }
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
     * send function setter/getter
     * 
     * @param (function) user defined send function
     * @param (mixed) function parameter
     * @return (array) function list [(fucntion,parameter)]
     * @type parameter
     */
    sendfunc (fnc, prm) {
        try {
            return this.confmng("sendfunc", fnc, prm);
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
        try {
	    return this.confmng("uri", prm);
	} catch (e) {
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
     * message component setter/getter
     * 
     * @param (mixed) text/mofron-comp-text: message contents
     *                mofron-comp-message: replace message component
     *                undefined: call as getter
     * @return (mofron-comp-message) message component
     * @type function
     */
    message (prm) {
        try {
            if (true === comutl.isinc(prm, 'Message')) {
                prm.config({ width: '100%', visible: false });
            } else if (null === prm) {
                this.message().config({ text: "", visible: false });
		this.height(this.height());
                return;
            } else if ("string" === typeof prm) {
                this.message().config({ text: prm, visible: true });
		this.height(this.height());
                return;
            }
            return this.innerComp("message", prm, Message);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * submit component setter/getter
     * 
     * @param (mixed) string: submit text contents
     *                component: submit component
     *                undefined: call as getter
     * @return (component) submit component
     * @type parameter
     */
    submitComp (prm) {
        try {
            if (true === comutl.iscmp(prm)) {
                let clk = (p1,p2,p3) => {
                    try {
		        p3.send();
                    } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                };
                prm.config({
                    size: new ConfArg("1.2rem","0.27rem"), effect: new Hrzpos("center"),
		    style: { "margin-top" : "0.3rem" },
		    event: new Click(new ConfArg(clk,this))
                });
            } else if ("string" === typeof prm) {
                this.submitComp().text(prm);
                return;
            }
            return this.innerComp("submitComp", prm, mofron.class.Component);
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
                if (true ===comutl.isinc(chd[cidx], "FormItem")) {
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
     *                 undefined: call as getter
     * @return (object) extend parameter
     * @type parameter
     */
    extParam (prm) {
        try {
	    return this.confmng('extParam', prm);
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */

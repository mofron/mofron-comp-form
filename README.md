# mofron-comp-form
form component for [mofron](https://github.com/simpart/mofron)
this component defined form interface. not for display.

# Sample

```javascript
require('mofron');
let Form   = require('mofron-comp-form');
let Input  = require('mofron-comp-inputtext');
let Button = require('mofron-comp-button');

let send_btn = new Button('send');
let form = new Form({
    param   : '/path/to/server/program',
    child   : [new Input(),
                   send_btn],
    visible : true
});

send_btn.clickEvent(
    function (frm) {
        try {
            frm.send();
        } catch (e) {
            console.error(e.stack);
        }
    },
    form
);
```

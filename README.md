# mofron-comp-form
[mofron](https://mofron.github.io/mofron/) is module based frontend framework.

form component for mofron

## Feature
 - send POST when submit component is clicked.
 - check automatically form item values.
 - show an error message if form item check is false.
## Attention
 - form component child must be a formitem component.

# Install
```
npm install mofron mofron-comp-form
```

# Parameter

| Short<br>Form | Parameter Name | Type | Description |
|:-------------:|:---------------|:-----|:------------|
| | getChildHeight | ||
| | enterSend | boolean | true: send form data when user press enter |
| | | | false: not send (default) |
| | callback | function | send event function |
| | | mix | event parameter |
| | sendEvent | function | send event function |
| | | mix | event parameter |
| | sendfunc | function | user defined send function |
| | | mixed | function parameter |
| | uri | string | send uri |
| | getValue | ||
| | message | mixed | text/mofron-comp-text: message contents |
| | | | mofron-comp-message: replace message component |
| | | | undefined: call as getter |
| | submitComp | mixed | string: submit text contents |
| | | | component: submit component |
| | | | undefined: call as getter |
| | clear | ||
| | extParam | object | extend parameter |
| | | | undefined: call as getter |


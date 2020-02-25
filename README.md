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

# Sample
```html
<require>
    <tag load="mofron-comp-form">Form</tag>
    <tag load="mofron-comp-input">Input</tag>
    <tag load="mofron-comp-radiolist">RadioList</tag>
    <tag load="mofron-comp-textarea">TextArea</tag>
    <tag load="mofron-layout-margin">Margin</tag>
</require>

<Form width="4rem" layout=Margin:("top","0.2rem")>
    <Input label="input:"></Input>
    <RadioList layout=Margin:("left","0.1rem")>
        <radio>radio_1</radio>
        <radio>radio_2</radio>
    </RadioList>
    <TextArea label="textarea:"></TextArea>
</Form>
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


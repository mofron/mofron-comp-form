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

|Simple<br>Param | Parameter Name | Type | Description |
|:--------------:|:---------------|:-----|:------------|
| | marginTop | string (size) | margin top size |
| | callback | function | send event function |
| | | mix | event parameter |
| | sendEvent | function | send event function |
| | | mix | event parameter |
| | uri | string | send uri |
| | submitConts | mixed | string: submit text contents |
| | | | component: submit component |
| | optionParam | object | extend parameter |
| | height | string (size) | form height |
| | | option | style option |


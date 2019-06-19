# mofron-comp-form
[mofron](https://mofron.github.io/mofron/) is module based frontend framework.

form component for [mofron](https://mofron.github.io/mofron/).

## feature

- send POST when submit component is clicked.
- check automatically form item values.
- show an error message if form item check is false.

## attention

- form component child must be a formitem component.

# Install

```
npm install mofron mofron-comp-form
```

# Sample

```html
<require>
    <tag module="mofron-comp-form">Form</tag>
    <tag module="mofron-comp-dropdown">DropDown</tag>
    <tag module="mofron-comp-input">Input</tag>
    <tag module="mofron-layout-margin">Margin</tag>
</require>

<script run=init>
let evt = (p1,p2,p3) => { console.log(p2); }
</script>

<Form sendEvent=evt layout=Margin(null,"0.2rem") width="3rem">
    <Input sendKey="input"></Input>
    <DropDown sendKey="dropdown">
        <text>test 1</text>
        <text>test 2</text>
        <text>test 3</text>
    </DropDown>
</Form>
```

# Parameter

| Simple<br>Param | Parameter Name     | Type             |    Description                          |
|:---------------:|:-------------------|:-----------------|:----------------------------------------|
|                 | callback           | function         | send result event function              |
|                 |                    | mixed            | callback function parameter             |
|                 | sendEvent          | function         | send event function (call before send)  |       
|                 |                    | mixed            | event parameter                         |
|        ◯        | uri                | string           | send uri                                |
|                 | submitConts        | string/component | submit text contents / submit component |
|                 | optionParam        | object           | extend post parameter                   |

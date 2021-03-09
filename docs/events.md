# Events

### On change

Change event would be trigged on choosing option

```js
/** in vanilla javascript */
document
  .querySelector('#sample-select')
  .addEventListener('change', function () {
    console.log(this.value);
    console.log(this.index);
  });

/** in jquery */
$('#sample-select').change(function () {
  console.log(this.value);
  console.log(this.index);
});
```

### On Opened

Opened event would be trigged when the combobow would open

```js
/** in vanilla javascript */
document
  .querySelector('#sample-select')
  .addEventListener('opened', function () {});

/** in jquery */
$('#sample-select').on('opened', function () {});
```

### On Closed

Closed event would be trigged when the combobow would open

```js
/** in vanilla javascript */
document
  .querySelector('#sample-select')
  .addEventListener('closed', function () {});

/** in jquery */
$('#sample-select').on('closed', function () {});
```

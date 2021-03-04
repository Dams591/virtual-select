# Events

### On change

Change event would be trigged on choosing option

```js
/** in vanilla javascript */
document
  .querySelector('#sample-select')
  .addEventListener('change', function () {
    console.log(this.value);
  });

/** in jquery */
$('#sample-select').change(function () {
  console.log(this.value);
});
```

### On Opened

Opened event would be trigged when the combobow would open

```js
/** in vanilla javascript */
document
  .querySelector('#sample-select')
  .addEventListener('opened', function () {
    console.log(this.value);
  });

/** in jquery */
$('#sample-select').on('opened', function () {
  console.log(this.value);
});
```

### On Closed

Closed event would be trigged when the combobow would open

```js
/** in vanilla javascript */
document
  .querySelector('#sample-select')
  .addEventListener('closed', function () {
    console.log(this.value);
  });

/** in jquery */
$('#sample-select').on('closed', function () {
  console.log(this.value);
});
```

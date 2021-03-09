# Properties

| Name                     | Type              | Default value                                          | Description                                                                                                           |
| ------------------------ | ----------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| additionalClasses        | String            |                                                        | Additional classes for wrapper element                                                                                |
| aliasKey                 | String            | alias                                                  | Object key to use to get alias from options array                                                                     |
| allowNewOption           | Boolean           | false                                                  | Allow to add new option by searching                                                                                  |
| allowNoneOption          | Boolean           | false                                                  | In single selection mode only and when keep always open is on: display a none option that clears the selection        |
| autoSelectFirstOption    | Boolean           | false                                                  | Select first option by default on load                                                                                |
| descriptionKey           | String            | description                                            | Object key to use to get description from options array                                                               |
| disabledOptions          | Array             | []                                                     | List of values to disable options <br/>e.g - [2, 3, 9]                                                                |
| disableSelectAll         | Boolean           | false                                                  | Disable select all feature of multiple select                                                                         |
| dropboxWidth             | String            |                                                        | Custom width for dropbox                                                                                              |
| ele                      | String \| Element |                                                        | DOM element to initialize plugin<br/>String - #sample-select <br/>Element - document.querySelector('#sample-select')  |
| hasOptionDescription     | Boolean           | false                                                  | Has description to show along with label                                                                              |
| hideClearButton          | Boolean           | false                                                  | Hide clear value button                                                                                               |
| itemsSelectedMessage     | String            | selected                                               | Message display next to the number of selected items                                                                  |
| keepAlwaysOpen           | Boolean           | false                                                  | Keep dropbox always open with fixed height                                                                            |
| labelKey                 | String            | label                                                  | Object key to use to get label from options array                                                                     |
| markSearchResults        | Boolean           | false                                                  | Mark matched term in label                                                                                            |
| maxValues                | Number            | 0                                                      | Maximum no.of options allowed to choose in multiple select<br>0 - for no limit                                        |
| multiple                 | Boolean           | false                                                  | Enable multi-select                                                                                                   |
| name                     | String            |                                                        | Name attribute for hidden input<br>It would be useful for form submit to server                                       |
| noneOptionText           | String            | None                                                   | Text to be display if allowNone option is active                                                                      |
| noOfDisplayValues        | Number            | 50                                                     | Maximum no.of values to show in the tooltip for multi-select                                                          |
| noOptionsText            | String            | No options found                                       | Text to show when no options to show                                                                                  |
| noSearchResultsText      | String            | No results found                                       | Text to show when no results on search                                                                                |
| optionHeight             | String            | 40px \| 60px                                           | Height of each dropdown options <br/>60px - When hasOptionDescription is true                                         |
| options                  | Array             | []                                                     | List of options <br/>[<br/> { label: 'Option 1', value: '1' }, <br/> { label: 'Option 2', value: '2' }<br/> ...<br/>] |
| options[].alias          | String \| Array   |                                                        | Alternative labels to use on search.<br/>Array of string or comma separated string.                                   |
| options[].description    | String            |                                                        | Text to show along with label                                                                                         |
| options[].options        | Array             |                                                        | List of options for option group                                                                                      |
| optionsCount             | Number            | 5 \| 4                                                 | No.of options to show on viewport <br/>4 - When hasOptionDescription is true                                          |
| placeholder              | String            | Select                                                 | Text to show when no options selected                                                                                 |
| popupDropboxBreakpoint   | String            | 576px                                                  | Maximum screen width that allowed to show dropbox as popup                                                            |
| position                 | String            | auto                                                   | Position of dropbox (top, bottom, auto)                                                                               |
| search                   | Boolean           | false - for single select <br/>true - for multi-select | Enable search feature                                                                                                 |
| searchPlaceholder        | String            | Search...                                              | Text to be displayed inside the search input                                                                          |
| selectAllText            | String            | Select all                                             | Text to show near select all checkbox when search is disabled                                                         |
| selectedValue            | String \| Array   |                                                        | Single value or array of values to select on init                                                                     |
| showDropboxAsPopup       | Boolean           | true                                                   | Show dropbox as popup on small screen like mobile                                                                     |
| showSelectedOptionsFirst | Boolean           | false                                                  | Show selected options at the top of the dropbox                                                                       |
| silentInitialValueSet    | Boolean           | false                                                  | To avoid "change event" trigger on setting initial value                                                              |
| tooltipAlignment         | String            | center                                                 | CSS Text alignment for tooltip                                                                                        |
| tooltipFontSize          | String            | 14px                                                   | Font size for tooltip                                                                                                 |
| tooltipMaxWidth          | String            | 300px                                                  | CSS max width for tooltip                                                                                             |
| valueKey                 | String            | value                                                  | Object key to use to get value from options array                                                                     |
| zIndex                   | Number            | 1                                                      | CSS z-index value for dropbox                                                                                         |

## Using properties on initialization

```js
VirtualSelect.init({
  ...
  valueKey: 'id',
  search: true,
  ...
});
```

## Using properties as DOM attributes

To use an property as an attribute, property name should be `hyphenated` and prefixed with `data-*` (e.g. `noOptionsText` => `data-no-options-text`)

```html
<div
  id="sample-select"
  multiple
  placeholder="Select country"
  data-value-key="id"
  data-search="true"
></div>
```

<br>

**Following properties are not allowed to use as attribute**

- ele
- options
- disabledOptions
- selectedValue

<br>

**Following properties should be used without `data-*` as prefix**

- multiple
- placeholder
- name

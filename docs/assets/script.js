var config = {
  name: 'Virtual Select',
  repo: 'sa-si-dev/virtual-select',
  zIndex: 99,
};

window.$docsify = {
  name: config.name,
  repo: config.repo,
  themeColor: '#512DA8',
  homepage: 'get-started.md',
  topMargin: 50,
  loadSidebar: true,
  coverpage: true,
  auto2top: true,
  executeScript: true,
  copyCode: {
    buttonText: 'Copy',
  },
  plugins: [docsifyPlugin],
};

function docsifyPlugin(hook, vm) {
  hook.beforeEach(docsifyPluginBeforeEach);
}

function docsifyPluginBeforeEach(content) {
  content = replacePlaceholders(content);

  return content;
}

function replacePlaceholdersForElement(selector) {
  var ele = document.querySelector(selector);

  if (!ele) {
    return;
  }

  ele.innerHTML = replacePlaceholders(ele.innerHTML);
}

function replacePlaceholders(content) {
  Object.keys(config).forEach(function (placeholder) {
    var value = config[placeholder];

    if (value) {
      var regexp = new RegExp('{{' + placeholder + '}}', 'g');
      content = content.replace(regexp, value);
    }
  });

  return content;
}

function getOptions(count, includeDesc) {
  if (!count) {
    count = 100000;
  }

  var optionsData = [];

  for (var i = 1; i <= count; i++) {
    let optionData = { value: i, label: 'Option ' + i };

    if (includeDesc) {
      optionData.description = 'Description ' + i;
    }

    optionsData.push(optionData);
  }

  return optionsData;

  return [
    { label: 'Options 1', value: '"1"' },
    { label: 'Options 2', value: '2' },
    { label: 'Options 3', value: '3' },
  ];
}

function getGroupOptions() {
  let optGroupData = [];

  for (let i = 1; i <= 3; i++) {
    let label = `Option group ${i}`;
    let options = [];

    for (let j = 1; j <= 3; j++) {
      let value = `${i}-${j}`;
      let label = `Option ${value}`;

      options.push({ value: value, label: label });
    }

    optGroupData.push({ label: label, options: options });
  }

  return optGroupData;
}

function initPageGetStarted() {
  replacePlaceholdersForElement('.cover-main');

  VirtualSelect.init({
    ele: '#single-select',
    options: [
      {
        value: '"Australia"',
        label: 'Ford Focus',
      },
      {
        value: 'Australia',
        label: 'Porsche',
      },
      {
        value: 'Australia',
        label: 'Mercedes',
      },
    ],
    //search: true,
    //keepAlwaysOpen: true,
    //  appendToBody: true,
    //options: getOptions(),
    allowNoneOption: false,
    selectedValue: 'Australia',
    //showSelectedOptionsFirst: true,
    placeholder: 'Select a single value',
    zIndex: config.zIndex,
  });

  let maxLength = getOptions()
    .map((el) => el.label)
    .reduce((a, b) => (a.length > b.length ? a : b), '');
  // console.log(maxLength);

  VirtualSelect.init({
    ele: '#multiple-select',
    keepAlwaysOpen: true,
    //options: getOptions(),
    options: [
      {
        value: 'true',
        label: 'true',
      },
      {
        value: 'false',
        label: 'false',
      },
      {
        value: 'Australia',
        label: 'Australia',
      },
    ],
    // showSelectedOptionsFirst: true,
    multiple: true,
    placeholder: 'Select multiple values',
    selectedValue: ['Australia'],
    addSeachToSelection: true,
    //selectedValue: [2, 3, 4, 5],
    //search: true,
    //disableSelectAll: true,
    zIndex: config.zIndex,
  });

  document
    .querySelector('#multiple-select')
    .addEventListener('change', function () {
      // console.log('indexes' + this.index);
      // console.log('values' + this.value);
    });

  // setTimeout(() => {
  //   document
  //     .querySelector('#multiple-select')
  //     .setOptions([{ value: 1, label: 'Option 1' }], true);
  // }, 5000);

  // setTimeout(() => {
  //   document.querySelector('#multiple-select').setOptions(
  //     [
  //       { value: 1, label: 'Option 1' },
  //       { value: 2, label: 'Option 3' },
  //     ],
  //     true
  //   );
  // }, 10000);
}

function initPageExamples() {
  VirtualSelect.init({
    ele: '#single-select',
    options: getOptions(),
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#single-search-select',
    options: getOptions(),
    search: true,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#sample-multi-select',
    options: getOptions(),
    multiple: true,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#multi-select-without-search',
    options: getOptions(),
    multiple: true,
    search: false,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#single-disabled-select',
    options: getOptions(),
    disabledOptions: [2, 6, 9],
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#option-group-select',
    options: getGroupOptions(),
    search: true,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#preselect-single-select',
    options: getOptions(),
    selectedValue: 3,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#preselect-multiple-select',
    options: getOptions(),
    multiple: true,
    selectedValue: [3, 4],
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#hide-clear-select',
    options: getOptions(),
    hideClearButton: true,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#custom-width-select',
    options: getOptions(),
    dropboxWidth: '130px',
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#new-option-select',
    options: getOptions(3),
    allowNewOption: true,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#mark-results-select',
    options: getOptions(),
    search: true,
    markSearchResults: true,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#selected-first-select',
    options: getOptions(30),
    multiple: true,
    showSelectedOptionsFirst: true,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#alias-select',
    options: [
      { label: 'Colors', value: 'colors', alias: 'Orange, Red' },
      { label: 'Fruits', value: 'fruits', alias: ['Orange', 'Apple'] },
      { label: 'Months', value: 'months', alias: 'January' },
      { label: 'Others', value: 'others' },
    ],
    search: true,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#keep-open-select',
    options: getOptions(),
    search: true,
    keepAlwaysOpen: true,
  });

  VirtualSelect.init({
    ele: '#max-values-select',
    options: getOptions(),
    multiple: true,
    maxValues: 4,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#with-description-select',
    options: getOptions(null, true),
    hasOptionDescription: true,
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#single-show-as-popup-select',
    options: getOptions(),
    popupDropboxBreakpoint: '3000px',
    placeholder: 'Select a single value',
    zIndex: config.zIndex,
  });

  VirtualSelect.init({
    ele: '#multiple-show-as-popup-select',
    options: getOptions(),
    popupDropboxBreakpoint: '3000px',
    placeholder: 'Select multiple values',
    multiple: true,
    zIndex: config.zIndex,
  });
}

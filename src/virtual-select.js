import { Utils, DomUtils } from './utils';

const virtualSelectVersion = 'v1.0.6';
const dropboxCloseButtonFullHeight = 48;
const searchHeight = 40;
const noneOptionValue = '{#virtual-select-none-option#}';

const keyDownMethodMapping = {
  13: 'onEnterPress',
  27: 'onEscPress',
  38: 'onUpArrowPress',
  40: 'onDownArrowPress',
};

/** Class representing VirtualSelect */
export class VirtualSelect {
  /**
   * Create a VirtualSelect
   * @property {(element|string)} ele - Parent element to render VirtualSelect
   * @property {object[]} options - Array of object to show as options
   * @property {(string|number)} options[].value - Value of the option
   * @property {(string|number)} options[].label - Display text of the option
   * @property {(string|number)} options[].description - Text to show along with label
   * @property {(string|array)} options[].alias - Alternative labels to use on search. Array of string or comma separated string.
   * @property {array} options[].options - List of options for option group
   * @property {string} [valueKey=value] - Object key to use to get value from options array
   * @property {string} [labelKey=label] - Object key to use to get label from options array
   * @property {string} [descriptionKey=description] - Object key to use to get description from options array
   * @property {string} [aliasKey=alias] - Key name to get alias from options object
   * @property {boolean} [multiple=false] - Enable multiselect
   * @property {boolean} [search=false] - Enable search
   * @property {boolean} [hideClearButton=false] - Hide clear button
   * @property {boolean} [autoSelectFirstOption=false] - Select first option by default on load
   * @property {boolean} [hasOptionDescription=false] - Has description to show along with label
   * @property {boolean} [disableSelectAll=false] - Disable select all feature of multiple select
   * @property {string} [optionsCount=5|4] - No.of options to show on viewport
   * @property {string} [optionHeight=40px|60px] - Height of each dropdown options
   * @property {string} [position=auto] - Position of dropbox (top, bottom, auto)
   * @property {string} [placeholder=Select] - Text to show when no options selected
   * @property {string} [noOptionsText=No options found] - Text to show when no options to show
   * @property {string} [noSearchResultsText=No results found] - Text to show when no results on search
   * @property {string} [selectAllText=Select all] - Text to show near select all checkbox when search is disabled
   * @property {string} [addSearchToSelectionText=Add To Selection] - Text to show near select all checkbox when search is disabled
   * @property {array} [disabledOptions] - Options to disable (array of values)
   * @property {(string|array)} [selectedValue] - Single value or array of values to select on init
   * @property {boolean} [silentInitialValueSet=false] - To avoid "change event" trigger on setting initial value
   * @property {string} [dropboxWidth] - Custom width for dropbox
   * @property {number} [zIndex=1] - CSS z-index value for dropbox
   * @property {number} [noOfDisplayValues=50] - Maximum no.of values to show in the tooltip for multi-select
   * @property {boolean} [allowNewOption=false] - Allow to add new option by searching
   * @property {boolean} [markSearchResults=false] - Mark matched term in label
   * @property {string} [tooltipFontSize=14px] - Font size for tooltip
   * @property {string} [tooltipAlignment=center] - CSS Text alignment for tooltip
   * @property {string} [tooltipMaxWidth=300px] - CSS max width for tooltip
   * @property {boolean} [showSelectedOptionsFirst=false] - Show selected options at the top of the dropbox
   * @property {boolean} [slicerMode=false] - Put unavailable options at the end of the list (useful in slice mode)
   * @property {boolean} [selectAllOnSingleItemClick=false] - Name attribute for hidden input
   * @property {string} [name] - Name attribute for hidden input
   * @property {boolean} [keepAlwaysOpen] - Keep dropbox always open with fixed height
   * @property {number} [maxValues=0] - Maximum no.of options allowed to choose in multiple select
   * @property {string} [additionalClasses] - Additional classes for wrapper element
   * @property {boolean} [showDropboxAsPopup=true] - Show dropbox as popup on small screen like mobile
   * @property {string} [popupDropboxBreakpoint=576px] - Maximum screen width that allowed to show dropbox as popup
   * @property {function} [onServerSearch] - Callback function to integrate server search
   * @property {string} [searchPlaceholder=Search...] - Text to show inside search input
   * @property {boolean} [allowNoneOption=false] - In single selection mode only and when keep always open is on: display a none option that clears the selection
   * @property {string} [noneOptionText=None] - Text to be display if allowNone option is active
   * @property {boolean} [appendTo=null] - When set and keepAlways open is off we are adding the dropbox element to the given element
   * @property {boolean} [appendToBody=false] - When set to true and keepAlways open is off we are adding the dropbox element to the body
   * @property {boolean} [appendToParentContainer=null] - When using appendTo we need to know the parent container to calculate the position
   * @property {boolean} [addSeachToSelection=false] - Add an option on search to add the results to current selection
   * @property {function} [searchCallback=null] - Add an option to call a function when a search is happening
   * @property {boolean} [selectAllOnlyVisible=true] - Select only visible options on clicking select all checkbox when options filtered by search
   */
  constructor(options) {
    try {
      this.setProps(options);
      this.setDisabledOptions(options.disabledOptions);
      this.setOptions(options.options);
      this.render();
    } catch (e) {
      console.warn(`Couldn't initiate Virtual Select`);
      console.error(e);
    }
  }

  /** render methods - start */
  render() {
    if (!this.$ele) {
      return;
    }

    let wrapperClasses = 'vscomp-wrapper';
    let valueTooltip = this.getTooltipAttrText('', !this.multiple, true);
    let clearButtonTooltip = this.getTooltipAttrText('Clear');

    let dropboxContainerStyle = {
      'z-index': this.zIndex,
    };

    const getWrapperClasses = () => {
      let classes = '';

      if (this.additionalClasses) {
        classes += ' ' + this.additionalClasses;
      }

      if (this.multiple) {
        classes += ' multiple';

        if (!this.disableSelectAll) {
          classes += ' has-select-all';
        }
      }

      if (this.position === 'top') {
        classes += ' position-top';
      }

      if (!this.hideClearButton) {
        classes += ' has-clear-button';
      }

      if (this.keepAlwaysOpen) {
        classes += ' keep-always-open opened';
      } else {
        classes += ' closed';
      }

      if (this.showAsPopup) {
        classes += ' show-as-popup';
      } else {
        if (this.dropboxWidth) {
          dropboxContainerStyle.width = this.dropboxWidth;
        }
      }

      if (this.hasSearch) {
        classes += ' has-search-input';
      }

      return classes;
    };

    wrapperClasses += getWrapperClasses();

    this.guid = Utils.generateUUID();

    this.customAppend =
      !this.keepAlwaysOpen && (this.appendToBody || this.appendTo !== null);

    let dropboxContainer = `<div id="vs-${
      this.guid
    }" class="vscomp-dropbox-container" ${DomUtils.getStyleText(
      dropboxContainerStyle
    )}>
      <div class="vscomp-dropbox">
        <div class="vscomp-search-wrapper"></div>

        <div class="vscomp-options-container">
          <div class="vscomp-options-loader"></div>

          <div class="vscomp-options-list">
            <div class="vscomp-options"></div>
          </div>
        </div>

        <div class="vscomp-no-options">${this.noOptionsText}</div>
        <div class="vscomp-no-search-results">${this.noSearchResultsText}</div>

        <span class="vscomp-dropbox-close-button"><i class="vscomp-clear-icon"></i></span>
      </div>
    </div>`;

    let html = `<div class="${wrapperClasses}" tabindex="0">
        <input type="hidden" name="${this.name}" class="vscomp-hidden-input">

        <div class="vscomp-toggle-button">
          <div class="vscomp-value" ${valueTooltip}>
            ${this.placeholder}
          </div>

          <div class="vscomp-arrow"></div>

          <div class="vscomp-clear-button toggle-button-child" ${clearButtonTooltip}>
            <i class="vscomp-clear-icon"></i>
          </div>
        </div>

        ${!this.customAppend ? dropboxContainer : ''}

      </div>`;

    this.$ele.innerHTML = html;
    this.$body = document.querySelector('body');

    if (this.appendTo) {
      this.$body = this.appendTo;
    }

    this.$wrapper = this.$ele.querySelector('.vscomp-wrapper');
    this.$toggleButton = this.$ele.querySelector('.vscomp-toggle-button');
    this.$clearButton = this.$ele.querySelector('.vscomp-clear-button');
    this.$dropboxCloseButton = this.$ele.querySelector(
      '.vscomp-dropbox-close-button'
    );

    if (this.customAppend) {
      // -----------------------
      // Append to body (beta)
      // -----------------------

      this.$body.append(
        document.createRange().createContextualFragment(dropboxContainer)
      );

      this.$dropboxContainer = document.querySelector(
        `#vs-${this.guid}.vscomp-dropbox-container`
      );

      this.$dropboxEl = document.querySelector(`#vs-${this.guid}`);

      let classes = 'vscomp-wrapper-body';
      classes += getWrapperClasses();

      DomUtils.addClass(this.$dropboxEl, `${classes}`);
    } else {
      this.$dropboxContainer = this.$ele.querySelector(
        '.vscomp-dropbox-container'
      );
      this.$dropboxEl = this.$ele;
    }

    this.$search = this.$dropboxEl.querySelector('.vscomp-search-wrapper');
    this.$optionsContainer = this.$dropboxEl.querySelector(
      '.vscomp-options-container'
    );

    this.$optionsList = this.$dropboxEl.querySelector('.vscomp-options-list');
    this.$options = this.$dropboxEl.querySelector('.vscomp-options');
    this.$valueText = this.$ele.querySelector('.vscomp-value');
    this.$hiddenInput = this.$ele.querySelector('.vscomp-hidden-input');
    this.$noOptions = this.$dropboxEl.querySelector('.vscomp-no-options');
    this.$noSearchResults = this.$dropboxEl.querySelector(
      '.vscomp-no-search-results'
    );

    this.afterRenderWrapper();
  }

  renderOptions() {
    let html = '';
    let visibleOptions = this.getVisibleOptions();
    let checkboxHtml = '';
    let newOptionIconHtml = '';
    let markSearchResults =
      this.markSearchResults && this.searchValue ? true : false;
    let searchRegex;

    let styleText = DomUtils.getStyleText({
      height: this.optionHeight + 'px',
    });

    if (markSearchResults) {
      searchRegex = new RegExp(`(${this.searchValue})`, 'gi');
    }

    if (this.multiple) {
      checkboxHtml = '<span class="checkbox-icon"></span>';
    }

    if (this.allowNewOption) {
      let newOptionTooltip = this.getTooltipAttrText('New Option');
      newOptionIconHtml = `<span class="vscomp-new-option-icon" ${newOptionTooltip}></span>`;
    }

    visibleOptions.forEach((d) => {
      let optionLabel = d.label;
      let optionClasses = 'vscomp-option';
      let optionTooltip = this.getTooltipAttrText('', true);
      let leftSection = checkboxHtml;
      let rightSection = '';
      let description = '';

      if (d.classNames) {
        optionClasses += ` ${d.classNames}`;
      }

      if (d.isFocused) {
        optionClasses += ' focused';
      }

      if (d.isDisabled) {
        optionClasses += ' disabled';
      }

      if (d.isGroupTitle) {
        optionClasses += ' group-title';
        leftSection = '';
      } else {
        if (d.isSelected) {
          optionClasses += ' selected';
        }
      }

      if (d.isGroupOption) {
        optionClasses += ' group-option';
      }

      if (d.description) {
        description = `<div class="vscomp-option-description" ${optionTooltip}>${d.description}</div>`;
      }

      if (d.isCurrentNew) {
        optionClasses += ' current-new';
        rightSection += newOptionIconHtml;
      } else {
        if (markSearchResults && !d.isGroupTitle) {
          optionLabel = optionLabel.replace(searchRegex, '<mark>$1</mark>');
        }
      }

      html += `<div class="${optionClasses}" data-value="${
        d.value
      }" data-index="${d.index}" data-visible-index="${
        d.visibleIndex
      }" ${styleText}>
          ${leftSection}
          <span title="${optionLabel}" class="vscomp-option-text ${
        d.value === noneOptionValue ? 'none' : ''
      }" ${optionTooltip}>
            ${optionLabel}
          </span>
          ${description}
          ${rightSection}
        </div>`;
    });

    this.$options.innerHTML = html;
    let hasNoOptions = !this.options.length;
    let hasNoSearchResults = !hasNoOptions && !visibleOptions.length;

    if (!this.allowNewOption) {
      DomUtils.toggleClass(
        this.$wrapper,
        'has-no-search-results',
        hasNoSearchResults
      );

      if (this.appendToBody || this.appendTo !== null)
        DomUtils.toggleClass(
          this.$dropboxEl,
          'has-no-search-results',
          hasNoSearchResults
        );
    }

    DomUtils.toggleClass(this.$wrapper, 'has-no-options', hasNoOptions);
    this.setOptionsPosition();
    this.setOptionsTooltip();
    //this.moveFocusedOptionToView();
  }

  renderSearch() {
    if (!this.hasSearchContainer) {
      return;
    }

    let checkboxHtml = '';
    let searchInput = '';

    // if (this.multiple && !this.disableSelectAll) {
    //   checkboxHtml = `<span class="vscomp-toggle-all-button">
    //       <span class="checkbox-icon vscomp-toggle-all-checkbox"></span>
    //       <span class="vscomp-toggle-all-label">${this.selectAllText}</span>
    //     </span>`;
    // }

    // if (this.hasSearch) {
    //   searchInput = `<input type="text" class="vscomp-search-input" placeholder="${this.searchPlaceholder}">
    //   <span class="vscomp-search-clear">&times;</span>`;
    // }

    // let html = `<div class="vscomp-search-container">
    //     ${checkboxHtml}
    //     ${searchInput}
    //   </div>`;

    if (this.hasSearch) {
      searchInput = ` <div class="vscomp-search-container">
          <input type="text" class="vscomp-search-input" placeholder="${this.searchPlaceholder}">
          <span class="vscomp-search-clear">&times;</span>
        </div>`;
    }

    if (this.multiple && !this.disableSelectAll) {
      checkboxHtml = `<div class="vs-comp-select-all-container">
        <span class="vscomp-toggle-all-button">
          <span class="checkbox-icon vscomp-toggle-all-checkbox"></span>
          <span class="vscomp-toggle-all-label">${this.selectAllText}</span>
        </span>
        </div>`;
    }

    if (this.hasSearch && this.multiple && this.addSeachToSelection) {
      checkboxHtml += `<div class="vs-comp-select-add-search-container">
        <span class="vscomp-toggle-add-search-button">
          <span class="checkbox-icon vscomp-toggle-add-search-checkbox"></span>
          <span class="vscomp-toggle-add-search-label">${this.addSearchToSelectionText}</span>
        </span>
        </div>`;
    }

    let html = `${searchInput}${checkboxHtml}`;

    this.$search.innerHTML = html;
    this.$searchInput = this.$dropboxEl.querySelector('.vscomp-search-input');
    this.$searchClear = this.$dropboxEl.querySelector('.vscomp-search-clear');
    this.$toggleAllButton = this.$dropboxEl.querySelector(
      '.vscomp-toggle-all-button'
    );
    this.$toggleAllCheckbox = this.$dropboxEl.querySelector(
      '.vscomp-toggle-all-checkbox'
    );
    this.$toggleAddSeachContainer = this.$dropboxEl.querySelector(
      '.vs-comp-select-add-search-container'
    );
    this.$toggleAddSeachButton = this.$dropboxEl.querySelector(
      '.vscomp-toggle-add-search-button'
    );
    this.$toggleAddSeachCheckbox = this.$dropboxEl.querySelector(
      '.vscomp-toggle-add-search-checkbox'
    );

    this.addEvent(this.$searchInput, 'keyup change', 'onSearch');
    this.addEvent(this.$searchClear, 'click', 'onSearchClear');
    this.addEvent(this.$toggleAllButton, 'click', 'onToggleAllOptions');
    this.addEvent(this.$toggleAddSeachButton, 'click', 'onAddSeachToSelection');
  }

  /** render methods - end */

  /** dom event methods - start */
  addEvents() {
    this.addEvent(document, 'click', 'onDocumentClick');
    this.addEvent(this.$wrapper, 'keydown', 'onKeyDown');
    this.addEvent(this.$toggleButton, 'click', 'onToggleButtonClick');
    this.addEvent(this.$clearButton, 'click', 'onClearButtonClick');
    this.addEvent(this.$dropboxContainer, 'click', 'onDropboxContainerClick');
    this.addEvent(
      this.$dropboxCloseButton,
      'click',
      'onDropboxCloseButtonClick'
    );

    this.addEvent(this.$optionsContainer, 'scroll', 'onOptionsScroll');

    this.addEvent(this.$options, 'click', 'onOptionsClick');
    this.addEvent(this.$options, 'mouseover', 'onOptionsMouseOver');
    this.addEvent(this.$dropboxContainer, 'mouseleave', 'onOptionsMouseLeave');
    this.addEvent(this.$options, 'touchmove', 'onOptionsTouchMove');
  }

  onOptionsMouseLeave() {
    this.removeOptionFocus();
  }

  addEvent($ele, events, method) {
    if (!$ele) {
      return;
    }

    events = Utils.removeArrayEmpty(events.split(' '));

    events.forEach((event) => {
      let eventsKey = `${method}-${event}`;
      let callback = this.events[eventsKey];

      if (!callback) {
        callback = this[method].bind(this);
        this.events[eventsKey] = callback;
      }

      $ele = DomUtils.getElements($ele);

      $ele.forEach((_this) => {
        _this.addEventListener(event, callback);
      });
    });
  }

  dispatchEvent($ele, eventName) {
    if (!$ele) {
      return;
    }

    $ele = DomUtils.getElements($ele);

    setTimeout(() => {
      $ele.forEach((_this) => {
        _this.dispatchEvent(new Event(eventName, { bubbles: true }));
      });
    }, 0);
  }

  onDocumentClick(e) {
    if (
      (this.appendToBody || this.appendTo !== null) &&
      this.multiple &&
      this.isOpened() &&
      e.target.closest(`#vs-${this.guid}`)
    ) {
      return; // Don't close dropbox if append to body, multiple and click inside dropbow
      e.stopPropagation();
    }

    let $eleToKeepOpen = e.target.closest('.vscomp-wrapper');

    if ($eleToKeepOpen !== this.$wrapper) {
      this.closeDropbox();
    }
  }

  onKeyDown(e) {
    let key = e.which || e.keyCode;
    let method = keyDownMethodMapping[key];

    if (method) {
      this[method](e);
    }
  }

  onEnterPress() {
    if (!this.isOpened()) {
      this.openDropbox();
    } else {
      this.selectFocusedOption();
    }
  }

  onEscPress() {
    if (this.isOpened()) {
      this.closeDropbox();
    }
  }

  onDownArrowPress(e) {
    e.preventDefault();

    if (this.isOpened()) {
      this.focusOption('next');
    } else {
      this.openDropbox();
    }
  }

  onUpArrowPress(e) {
    e.preventDefault();

    if (this.isOpened()) {
      this.focusOption('previous');
    } else {
      this.openDropbox();
    }
  }

  onToggleButtonClick(e) {
    let childEle = e.target.closest('.toggle-button-child');

    if (childEle) {
      return;
    }

    this.toggleDropbox();
  }

  onClearButtonClick() {
    this.reset();
  }

  onOptionsScroll() {
    this.setVisibleOptions();
  }

  onOptionsClick(e) {
    this.selectOption(
      e.target.closest('.vscomp-option:not(.disabled):not(.group-title)')
    );
    if (this.multiple && this.showSelectedOptionsFirst) {
      // Move selected to top was triggering closeDropbow beacause of onDropboxContainerClick
      // When showSelectedOptionsFirst is on
      e.stopPropagation();
      return false;
    }
  }

  onDropboxContainerClick(e) {
    if (!e.target.closest('.vscomp-dropbox')) {
      this.closeDropbox();
    }
  }

  onDropboxCloseButtonClick() {
    this.closeDropbox();
  }

  onOptionsMouseOver(e) {
    let $ele = e.target.closest(
      '.vscomp-option:not(.disabled):not(.group-title)'
    );

    if ($ele && this.isOpened()) {
      this.focusOption(null, $ele);
    }
  }

  onOptionsTouchMove() {
    this.removeOptionFocus();
  }

  onSearch(e) {
    e.stopPropagation();
    this.setSearchValue(e.target.value, true);
  }

  onSearchClear() {
    this.setSearchValue('');
    this.focusSearchInput();
  }

  onToggleAllOptions() {
    this.toggleAllOptions();
  }

  onAddSeachToSelection() {
    if (!this.multiple || !this.searchValue) {
      return;
    }

    const isSelected = !DomUtils.hasClass(
      this.$toggleAddSeachCheckbox,
      'checked'
    );

    const selectedValues = this.selectedValues;
    const filteredValues = this.options.filter((o) => {
      if (o.isDisabled || o.isCurrentNew || o.isGroupTitle) {
        return;
      }

      return o.isVisible;
    });

    if (isSelected) {
      for (const opt of filteredValues) {
        if (selectedValues.indexOf(opt.value) === -1) {
          opt.isSelected = true;
          selectedValues.push(opt.value);
        }
      }
    } else {
      for (const opt of filteredValues) {
        const index = selectedValues.indexOf(opt.value);

        if (index !== -1) {
          opt.isSelected = false;
          selectedValues.splice(index, 1);
        }
      }
    }

    this.toggleAddSearchClass(isSelected);
    this.toggleAllOptionsClass(isSelected);
    this.setValue(selectedValues, [], true);
    this.renderOptions();
  }

  onResize() {
    if (this.appendToBody || this.appendTo !== null) {
      if (this.isOpened()) {
        this.closeDropbox(true);
      }
    } else this.setOptionsContainerHeight(true);
  }
  /** dom event methods - end */

  /** before event methods - start */
  beforeValueSet(isReset) {
    this.toggleAllOptionsClass(isReset ? false : undefined);
  }

  beforeSelectNewValue() {
    let newOption = this.getNewOption();
    let newIndex = newOption.index;

    this.newValues.push(newOption.value);
    this.setOptionProp(newIndex, 'isCurrentNew', false);
    this.setOptionProp(newIndex, 'isNew', true);

    /** using setTimeout to fix the issue of dropbox getting closed on select */
    setTimeout(() => {
      this.setSearchValue('');
      this.focusSearchInput();
    }, 0);
  }
  /** before event methods - end */

  /** after event methods - start */
  afterRenderWrapper() {
    this.$ele.setAttribute('name', this.name);

    DomUtils.addClass(this.$ele, 'vscomp-ele');
    this.renderSearch();
    this.setOptionsHeight();
    this.setVisibleOptions();
    this.setOptionsContainerHeight();
    this.addEvents();
    this.setMethods();

    if (
      typeof this.initialSelectedValue !== 'undefined' &&
      this.initialSelectedValue !== null
    ) {
      this.setValueMethod(
        this.initialSelectedValue,
        this.silentInitialValueSet
      );
    } else if (this.autoSelectFirstOption && this.visibleOptions.length) {
      this.setValueMethod(
        this.visibleOptions[0].value,
        this.silentInitialValueSet
      );
    }
  }

  afterSetOptionsContainerHeight(reset) {
    if (reset) {
      if (this.showAsPopup) {
        this.setVisibleOptions();
      }
    }
  }

  afterSetSearchValue() {
    if (this.hasServerSearch) {
      this.serverSearch();
    } else {
      this.setVisibleOptionsCount();
    }

    if (this.selectAllOnlyVisible) {
      this.toggleAllOptionsClass();
    }

    if (this.addSeachToSelection) {
      this.toggleAddSearchClass();
    }
  }

  afterSetVisibleOptionsCount() {
    this.scrollToTop();
    this.setOptionsHeight();
    this.setVisibleOptions();
  }

  afterValueSet(doNotScrollToTop) {
    if (!doNotScrollToTop) {
      this.scrollToTop();
    }
    this.setSearchValue('');
    this.renderOptions();
  }

  afterSetOptions(keepValue) {
    if (keepValue) {
      this.setSelectedProp();
    }

    this.setOptionsHeight();
    this.setVisibleOptions();

    if (this.showOptionsOnlyOnSearch) {
      this.setSearchValue('', false, true);
    }

    if (!keepValue) {
      this.reset();
    }
  }
  /** after event methods - end */

  /** set methods - start */
  setProps(options) {
    options = this.setDefaultProps(options);
    this.setPropsFromElementAttr(options);

    let convertToBoolean = Utils.convertToBoolean;

    this.$ele = options.ele;
    this.valueKey = options.valueKey;
    this.labelKey = options.labelKey;
    this.descriptionKey = options.descriptionKey;
    this.aliasKey = options.aliasKey;
    this.optionHeightText = options.optionHeight;
    this.optionHeight = parseFloat(this.optionHeightText);
    this.multiple = convertToBoolean(options.multiple);
    this.hasSearch = convertToBoolean(options.search);
    this.hideClearButton = convertToBoolean(options.hideClearButton);
    this.autoSelectFirstOption = convertToBoolean(
      options.autoSelectFirstOption
    );
    this.hasOptionDescription = convertToBoolean(options.hasOptionDescription);
    this.silentInitialValueSet = convertToBoolean(
      options.silentInitialValueSet
    );
    this.allowNewOption = convertToBoolean(options.allowNewOption);
    this.markSearchResults = convertToBoolean(options.markSearchResults);
    this.showSelectedOptionsFirst = convertToBoolean(
      options.showSelectedOptionsFirst
    );
    this.slicerMode = convertToBoolean(options.slicerMode);
    this.selectAllOnSingleItemClick = convertToBoolean(
      options.selectAllOnSingleItemClick
    );
    this.disableSelectAll = convertToBoolean(options.disableSelectAll);
    this.keepAlwaysOpen = convertToBoolean(options.keepAlwaysOpen);
    this.showDropboxAsPopup = convertToBoolean(options.showDropboxAsPopup);
    this.selectAllOnlyVisible = convertToBoolean(options.selectAllOnlyVisible);
    this.noOptionsText = options.noOptionsText;
    this.noSearchResultsText = options.noSearchResultsText;
    this.selectAllText = options.selectAllText;
    this.addSearchToSelectionText = options.addSearchToSelectionText;
    this.placeholder = options.placeholder;
    this.position = options.position;
    this.dropboxWidth = options.dropboxWidth;
    this.tooltipFontSize = options.tooltipFontSize;
    this.tooltipAlignment = options.tooltipAlignment;
    this.tooltipMaxWidth = options.tooltipMaxWidth;
    this.noOfDisplayValues = parseInt(options.noOfDisplayValues);
    this.zIndex = parseInt(options.zIndex);
    this.maxValues = parseInt(options.maxValues);
    this.name = options.name;
    this.additionalClasses = options.additionalClasses;
    this.initialSelectedValue = options.selectedValue;
    this.popupDropboxBreakpoint = options.popupDropboxBreakpoint;
    this.onServerSearch = options.onServerSearch;
    this.searchPlaceholder = options.searchPlaceholder;
    this.itemsSelectedMessage = options.itemsSelectedMessage;
    this.allowNoneOption = options.allowNoneOption;
    this.noneOptionText = options.noneOptionText;
    this.appendTo = options.appendTo;
    this.appendToBody = options.appendToBody;
    this.appendToParentContainer = options.appendToParentContainer;
    this.addSeachToSelection = convertToBoolean(options.addSeachToSelection);
    this.searchCallback = options.searchCallback || null;

    this.selectedValues = [];
    this.selectedIndexes = [];
    this.selectedOptions = [];
    this.newValues = [];
    this.events = {};
    this.tooltipEnterDelay = 200;
    this.transitionDuration = 250;
    this.searchValue = '';
    this.searchValueOriginal = '';
    this.isAllSelected = false;

    if (
      (options.search === undefined && this.multiple) ||
      this.allowNewOption
    ) {
      this.hasSearch = true;
    }

    if (this.maxValues) {
      this.disableSelectAll = true;
    }

    this.hasServerSearch = typeof this.onServerSearch === 'function';
    this.showAsPopup =
      this.showDropboxAsPopup &&
      !this.keepAlwaysOpen &&
      window.innerWidth <= parseFloat(this.popupDropboxBreakpoint);
    this.hasSearchContainer =
      this.hasSearch || (this.multiple && !this.disableSelectAll);
    this.optionsCount = this.getOptionsCount(options.optionsCount);
    this.halfOptionsCount = Math.ceil(this.optionsCount / 2);
    this.optionsHeight = this.getOptionsHeight();
  }

  setDefaultProps(options) {
    let defaultOptions = {
      valueKey: 'value',
      labelKey: 'label',
      descriptionKey: 'description',
      aliasKey: 'alias',
      optionsCount: 5,
      noOfDisplayValues: 50,
      optionHeight: '40px',
      multiple: false,
      hideClearButton: false,
      autoSelectFirstOption: false,
      hasOptionDescription: false,
      silentInitialValueSet: false,
      disableSelectAll: false,
      noOptionsText: 'No options found',
      noSearchResultsText: 'No results found',
      selectAllText: 'Select All',
      placeholder: 'Select',
      position: 'auto',
      zIndex: 1,
      allowNewOption: false,
      markSearchResults: false,
      tooltipFontSize: '14px',
      tooltipAlignment: 'center',
      tooltipMaxWidth: '300px',
      showSelectedOptionsFirst: false,
      slicerMode: false,
      selectAllOnSingleItemClick: false,
      name: '',
      additionalClasses: '',
      keepAlwaysOpen: false,
      maxValues: 0,
      showDropboxAsPopup: true,
      popupDropboxBreakpoint: '576px',
      searchPlaceholder: 'Search...',
      itemsSelectedMessage: 'selected',
      allowNoneOption: false,
      noneOptionText: 'None',
      appendTo: null,
      appendToBody: false,
      appendToParentContainer: null,
      selectAllOnlyVisible: true,
      addSeachToSelection: false,
      addSearchToSelectionText: 'Add to selection',
    };

    if (options.hasOptionDescription) {
      defaultOptions.optionsCount = 4;
      defaultOptions.optionHeight = '60px';
    }

    return Object.assign(defaultOptions, options);
  }

  setPropsFromElementAttr(options) {
    let $ele = options.ele;
    let mapping = {
      multiple: 'multiple',
      placeholder: 'placeholder',
      name: 'name',
      'data-value-key': 'valueKey',
      'data-label-key': 'labelKey',
      'data-description-key': 'descriptionKey',
      'data-alias-key': 'aliasKey',
      'data-search': 'search',
      'data-hide-clear-button': 'hideClearButton',
      'data-auto-select-first-option': 'autoSelectFirstOption',
      'data-has-option-description': 'hasOptionDescription',
      'data-options-count': 'optionsCount',
      'data-option-height': 'optionHeight',
      'data-position': 'position',
      'data-no-options-text': 'noOptionsText',
      'data-no-search-results-text': 'noSearchResultsText',
      'data-select-all-text': 'selectAllText',
      'data-silent-initial-value-set': 'silentInitialValueSet',
      'data-dropbox-width': 'dropboxWidth',
      'data-z-index': 'zIndex',
      'data-no-of-display-values': 'noOfDisplayValues',
      'data-allow-new-option': 'allowNewOption',
      'data-mark-search-results': 'markSearchResults',
      'data-tooltip-font-size': 'tooltipFontSize',
      'data-tooltip-alignment': 'tooltipAlignment',
      'data-tooltip-max-width': 'tooltipMaxWidth',
      'data-show-selected-options-first': 'showSelectedOptionsFirst',
      'data-slicer-mode': 'slicerMode',
      'data-select-all-on-single-item-click': 'selectAllOnSingleItemClick',
      'data-disable-select-all': 'disableSelectAll',
      'data-keep-always-open': 'keepAlwaysOpen',
      'data-max-values': 'maxValues',
      'data-additional-classes': 'additionalClasses',
      'data-show-dropbox-as-popup': 'showDropboxAsPopup',
      'data-popup-dropbox-breakpoint': 'popupDropboxBreakpoint',
      'data-select-all-only-visible': 'selectAllOnlyVisible',
    };

    for (let k in mapping) {
      let value = $ele.getAttribute(k);

      if (k === 'multiple' && (value === '' || value === 'true')) {
        value = true;
      }

      if (value) {
        options[mapping[k]] = value;
      }
    }
  }

  setMethods() {
    let $ele = this.$ele;
    $ele.virtualSelect = this;
    $ele.value = this.multiple ? [] : '';
    $ele.reset = VirtualSelect.reset;
    $ele.renderOptions = VirtualSelect.renderOptions;
    $ele.setValue = VirtualSelect.setValueMethod;
    $ele.setOptions = VirtualSelect.setOptionsMethod;
    $ele.setDisabledOptions = VirtualSelect.setDisabledOptionsMethod;
    $ele.toggleSelectAll = VirtualSelect.toggleSelectAll;
    $ele.isAllSelected = VirtualSelect.isAllSelected;
    $ele.addOption = VirtualSelect.addOptionMethod;
    $ele.getNewValue = VirtualSelect.getNewValueMethod;
    $ele.getDisplayValue = VirtualSelect.getDisplayValueMethod;
    $ele.open = VirtualSelect.openMethod;
    $ele.close = VirtualSelect.closeMethod;
    $ele.setSearchValue = VirtualSelect.setSearchValueMethod;
  }

  setValueMethod(value, silentChange) {
    if (!Array.isArray(value)) {
      value = [value];
    }

    value = value.map((v) => {
      return v || v == 0 ? v.toString() : '';
    });

    let validValues = [];
    let validIndexes = [];
    let validValuesSet = new Set([]);
    let valueSet = new Set(value);

    for (let d of this.options) {
      let isSelected = valueSet.has(d.value);

      if (isSelected && !d.isDisabled && !d.isGroupTitle) {
        if (validValuesSet.has(d.value) && this.multiple) break; // If multiple selection with same value only select one.

        d.isSelected = true;
        validValuesSet.add(d.value);
        validValues.push(d.value);
        validIndexes.push(d.index);
        if (!this.multiple) break; // if single selection only select one.
      } else {
        d.isSelected = false;
      }
    }

    if (!this.multiple) {
      validValues = validValues[0];
      validIndexes = validIndexes[0];
    }

    this.beforeValueSet();
    this.setValue(validValues, validIndexes, !silentChange);
    this.afterValueSet(silentChange && this.slicerMode);
  }

  setOptionsMethod(options, keepValue, silentChange) {
    let newoption = options != this.options;
    this.setOptions(options);
    this.afterSetOptions(keepValue, silentChange);
  }

  setDisabledOptionsMethod(disabledOptions) {
    this.setDisabledOptions(disabledOptions, true);
    this.setValueMethod(null);
    this.setVisibleOptions();
  }

  setDisabledOptions(disabledOptions = [], setOptionsProp = false) {
    disabledOptions = disabledOptions.map((d) => d.toString());
    this.disabledOptions = disabledOptions;

    if (setOptionsProp && disabledOptions.length) {
      this.options.forEach((d) => {
        d.isDisabled = disabledOptions.indexOf(d.value) !== -1;

        return d;
      });
    }
  }

  setOptions(options) {
    if (!options) {
      options = [];
    }

    let preparedOptions = [];
    let disabledOptions = this.disabledOptions;
    let hasDisabledOptions = disabledOptions.length;
    let valueKey = this.valueKey;
    let labelKey = this.labelKey;
    let descriptionKey = this.descriptionKey;
    let aliasKey = this.aliasKey;
    let hasOptionDescription = this.hasOptionDescription;
    let getString = Utils.getString;
    let convertToBoolean = Utils.convertToBoolean;
    let getAlias = this.getAlias;
    let index = 0;
    let hasOptionGroup = false;

    let prepareOption = (d) => {
      let value = getString(d[valueKey]);
      let childOptions = d.options;
      let isGroupTitle = childOptions ? true : false;
      let option = {
        index,
        value,
        label: getString(d[labelKey]),
        alias: getAlias(d[aliasKey]),
        //isVisible: true,
        isVisible: convertToBoolean(d.isVisible, true),
        isGroupTitle,
        classNames: d.classNames,
      };

      if (hasDisabledOptions) {
        option.isDisabled = disabledOptions.indexOf(value) !== -1;
      }

      if (d.isGroupOption) {
        option.isGroupOption = true;
        option.groupIndex = d.groupIndex;
      }

      if (hasOptionDescription) {
        option.description = getString(d[descriptionKey]);
      }

      preparedOptions.push(option);
      index++;

      if (isGroupTitle) {
        let groupIndex = option.index;
        hasOptionGroup = true;

        childOptions.forEach((d) => {
          d.isGroupOption = true;
          d.groupIndex = groupIndex;

          prepareOption(d);
        });
      }
    };

    // Add none option only when in list mode (always open and only)
    if (!this.multiple && this.allowNoneOption) {
      options.unshift({
        value: noneOptionValue,
        label: this.noneOptionText,
      });
    }

    options.forEach(prepareOption);

    this.options = preparedOptions;
    this.visibleOptionsCount = preparedOptions.length;
    this.lastOptionIndex = this.options.length - 1;
    this.newValues = [];
    this.hasOptionGroup = hasOptionGroup;
    this.setSortedOptions();
  }

  setServerOptions(options) {
    this.setOptionsMethod(options, true);

    let selectedOptions = this.selectedOptions;
    let newOptions = this.options;
    let optionsUpdated = false;

    /** merging already seleted options details with new options */
    if (selectedOptions.length) {
      let newOptionsValue = newOptions.map((d) => d.value);
      optionsUpdated = true;

      selectedOptions.forEach((d) => {
        if (newOptionsValue.indexOf(d.value) === -1) {
          d.isVisible = false;
          newOptions.push(d);
        }
      });

      this.setOptionsMethod(newOptions, true);
    }

    /** merging new search option */
    if (this.allowNewOption && this.searchValue) {
      let hasExactOption = newOptions.some(
        (d) => d.label.toLowerCase() === this.searchValue
      );

      if (!hasExactOption) {
        optionsUpdated = true;
        this.setNewOption();
      }
    }

    if (optionsUpdated) {
      this.setVisibleOptionsCount();

      if (this.multiple) {
        this.toggleAllOptionsClass();
      }

      if (this.addSeachToSelection) {
        this.toggleAddSearchClass();
      }

      this.setValueText();
    }
    DomUtils.removeClass(this.$wrapper, 'server-searching');
  }

  setSelectedOptions() {
    let selectedValues = this.selectedValues;
    this.selectedOptions = this.options.filter(
      (d) => selectedValues.indexOf(d.value) !== -1
    );
  }

  setSortedOptions() {
    let sortedOptions = [...this.options];

    if (this.showSelectedOptionsFirst && this.selectedValues.length) {
      if (this.hasOptionGroup) {
        sortedOptions = this.sortOptionsGroup(sortedOptions);
      } else {
        sortedOptions = this.sortOptions(sortedOptions);
      }
    }

    if (this.slicerMode) {
      sortedOptions = sortedOptions.sort((a, b) => {
        if (a.classNames === undefined && b.classNames !== undefined) {
          return -1;
        } else if (a.classNames !== undefined && b.classNames === undefined) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    this.sortedOptions = sortedOptions;
  }

  setVisibleOptions() {
    let visibleOptions = [...this.sortedOptions];
    let maxOptionsToShow = this.optionsCount * 2;
    let startIndex = this.getVisibleStartIndex();
    let newOption = this.getNewOption();
    let endIndex = startIndex + maxOptionsToShow - 1;
    let i = 0;

    if (newOption) {
      newOption.visibleIndex = i;
      i++;
    }

    visibleOptions = visibleOptions.filter((d) => {
      let inView = false;

      if (d.isVisible && !d.isCurrentNew) {
        inView = i >= startIndex && i <= endIndex;
        d.visibleIndex = i;
        i++;
      }

      return inView;
    });

    if (newOption) {
      visibleOptions = [newOption, ...visibleOptions];
    }

    this.visibleOptions = visibleOptions;
    this.renderOptions();
  }

  setOptionsPosition(startIndex) {
    if (startIndex === undefined) {
      startIndex = this.getVisibleStartIndex();
    }

    let top = startIndex * this.optionHeight;
    this.$options.style.transform = `translate3d(0, ${top}px, 0)`;
    DomUtils.setData(this.$options, 'top', top);
  }

  setOptionsTooltip() {
    let visibleOptions = this.getVisibleOptions();
    let hasOptionDescription = this.hasOptionDescription;

    visibleOptions.forEach((d) => {
      let $optionEle = this.$dropboxContainer.querySelector(
        `.vscomp-option[data-index="${d.index}"]`
      );

      DomUtils.setData(
        $optionEle.querySelector('.vscomp-option-text'),
        'tooltip',
        d.label
      );

      if (hasOptionDescription) {
        DomUtils.setData(
          $optionEle.querySelector('.vscomp-option-description'),
          'tooltip',
          d.description
        );
      }
    });
  }

  setValue(value, index, triggerEvent) {
    // Value
    if (!value) {
      this.selectedValues = [];
    } else if (Array.isArray(value)) {
      this.selectedValues = [...value];
    } else {
      this.selectedValues = [value];
    }

    let newValue = this.multiple
      ? this.selectedValues
      : this.selectedValues[0] || '';

    this.$ele.value = newValue;
    this.$hiddenInput.value = newValue;

    // Index
    if (typeof index === 'undefined') {
      this.selectedIndexes = [];
    } else if (Array.isArray(index)) {
      this.selectedIndexes = [...index];
    } else {
      this.selectedIndexes = [index];
    }

    let newIndex = '';
    if (this.multiple) {
      newIndex = this.selectedIndexes;
    } else if (
      this.selectedIndexes[0] !== null &&
      typeof this.selectedIndexes[0] !== 'undefined'
    ) {
      newIndex = this.selectedIndexes[0];
    }

    this.$ele.index = newIndex;
    this.$hiddenInput.index = newIndex;

    this.isMaxValuesSelected =
      this.maxValues && this.maxValues <= this.selectedValues.length
        ? true
        : false;
    this.setValueText();

    if (this.selectedValues && this.selectedValues[0] === noneOptionValue) {
      DomUtils.removeClass(this.$wrapper, 'has-value');
    } else {
      DomUtils.toggleClass(
        this.$wrapper,
        'has-value',
        Utils.isNotEmpty(this.selectedValues)
      );
    }

    DomUtils.toggleClass(
      this.$wrapper,
      'max-value-selected',
      this.isMaxValuesSelected
    );

    if (triggerEvent) {
      this.dispatchEvent(this.$ele, 'change');
    }

    // immediately move item to top if options is on.
    if (this.showSelectedOptionsFirst) {
      const lastScrollTop = this.$optionsContainer.scrollTop;
      this.moveSelectedOptionsFirst();
      this.$optionsContainer.scrollTop = lastScrollTop;
    }
  }

  setValueText() {
    let valueText = [];
    let valueTooltip = [];
    let selectedValues = this.selectedValues;
    let selectedIndexes = this.selectedIndexes;
    let selectedLength = selectedValues.length;
    let noOfDisplayValues = this.noOfDisplayValues;
    let maximumValuesToShow = 50;
    let selectedValuesCount = 0;

    if (this.isAllSelected && selectedLength > 1) {
      //this.$valueText.innerHTML = `All (${selectedLength})`;
      this.$valueText.innerHTML = `${selectedLength} ${this.itemsSelectedMessage}`;
    } else {
      const matchingOptions = this.options.filter(
        (d) => selectedValues.indexOf(d.value) !== -1
      );

      for (let d of this.options) {
        if (d.isCurrentNew) {
          continue;
        }

        if (
          selectedValuesCount > maximumValuesToShow ||
          (!this.multiple && selectedValuesCount === 1)
        ) {
          break;
        }

        let value = d.value;
        let label = d.label;
        let index = d.index;

        let matchingCondition =
          selectedValues.indexOf(value) !== -1 ||
          selectedIndexes.indexOf(index) !== -1;
        if (matchingOptions && matchingOptions.length > 1) {
          matchingCondition =
            selectedValues.indexOf(value) !== -1 &&
            selectedIndexes.indexOf(index) !== -1;
        }

        if (matchingCondition) {
          if (selectedValuesCount >= selectedValues.length) break; // do not add same values multiple

          valueText.push(label);
          selectedValuesCount++;

          if (selectedValuesCount <= noOfDisplayValues) {
            valueTooltip.push(`<span class="vscomp-value-tag">${label}</span>`);
          }
        }
      }

      let moreSelectedOptions = selectedLength - noOfDisplayValues;

      if (moreSelectedOptions > 0) {
        valueTooltip.push(
          `<span class="vscomp-value-tag more-value-count">+ ${moreSelectedOptions} more...</span>`
        );
      }

      const aggregatedValueText = valueText.join(', ');

      if (
        aggregatedValueText === '' ||
        (selectedValues && selectedValues[0] === noneOptionValue)
      ) {
        this.$valueText.innerHTML = this.placeholder;
      } else {
        this.$valueText.innerHTML = aggregatedValueText;

        if (this.multiple) {
          let maxValues = this.maxValues;

          if (DomUtils.hasEllipsis(this.$valueText) || maxValues) {
            let countText = `${selectedLength}`;

            if (maxValues) {
              countText += ` / ${maxValues}`;
            }

            /** replace comma delimitted list of selections with shorter text indicating selection count */
            // this.$valueText.innerHTML = `${countText} option${
            //   selectedLength === 1 ? '' : 's'
            // } selected`;

            this.$valueText.innerHTML = `${countText} ${this.itemsSelectedMessage}`;
          } else {
            /** removing tooltip if full value text is visible */
            valueTooltip = [];
          }
        }
      }
    }

    DomUtils.setData(this.$valueText, 'tooltip', valueTooltip.join(', '));
  }

  setSearchValue(value, skipInputSet, force) {
    if (value === this.searchValueOriginal && !force) {
      return;
    }

    if (!skipInputSet) {
      this.$searchInput.value = value;
    }

    let searchValue = value.toLowerCase().trim();
    this.searchValue = searchValue;
    this.searchValueOriginal = value;

    DomUtils.toggleClass(this.$wrapper, 'has-search-value', value);
    if (this.appendToBody || this.appendTo !== null)
      DomUtils.toggleClass(this.$dropboxEl, 'has-search-value', value);

    if (this.hasServerSearch) {
      this.serverSearch(searchValue);
      return;
    }

    let visibleOptionsCount = 0;
    let hasExactOption = false;
    let visibleOptionGroupsMapping;
    let isOptionVisible = this.isOptionVisible;

    if (this.hasOptionGroup) {
      visibleOptionGroupsMapping =
        this.getVisibleOptionGroupsMapping(searchValue);
    }

    this.options.forEach((d) => {
      if (d.isCurrentNew) {
        return;
      }

      let result = isOptionVisible(
        d,
        searchValue,
        hasExactOption,
        visibleOptionGroupsMapping
      );

      if (result.isVisible) {
        visibleOptionsCount++;
      }

      if (!hasExactOption) {
        hasExactOption = result.hasExactOption;
      }
    });

    if (this.allowNewOption) {
      if (searchValue && !hasExactOption) {
        this.setNewOption();
        visibleOptionsCount++;
      } else {
        this.removeNewOption();
      }
    }

    this.visibleOptionsCount = visibleOptionsCount;

    this.scrollToTop();
    this.setOptionsHeight();
    this.setVisibleOptions();
    this.afterSetSearchValue();

    if (this.searchCallback) {
      this.searchCallback(searchValue);
    }
  }

  setVisibleOptionsCount() {
    let visibleOptionsCount = 0;
    let hasExactOption = false;
    let visibleOptionGroupsMapping;
    let searchValue = this.searchValue;
    let showOptionsOnlyOnSearch = this.showOptionsOnlyOnSearch;
    let isOptionVisible = this.isOptionVisible.bind(this);

    if (this.hasOptionGroup) {
      visibleOptionGroupsMapping =
        this.getVisibleOptionGroupsMapping(searchValue);
    }

    this.options.forEach((d) => {
      if (d.isCurrentNew) {
        return;
      }

      let result;

      if (showOptionsOnlyOnSearch && !searchValue) {
        d.isVisible = false;
        result = {
          isVisible: false,
          hasExactOption: false,
        };
      } else {
        result = isOptionVisible(
          d,
          searchValue,
          hasExactOption,
          visibleOptionGroupsMapping
        );
      }

      if (result.isVisible) {
        visibleOptionsCount++;
      }

      if (!hasExactOption) {
        hasExactOption = result.hasExactOption;
      }
    });

    if (this.allowNewOption) {
      if (searchValue && !hasExactOption) {
        this.setNewOption();
        visibleOptionsCount++;
      } else {
        this.removeNewOption();
      }
    }

    this.visibleOptionsCount = visibleOptionsCount;

    this.afterSetVisibleOptionsCount();
  }

  setOptionProp(index, key, value) {
    if (!this.options[index]) {
      return;
    }

    this.options[index][key] = value;
  }

  setOptionsHeight() {
    this.$optionsList.style.height =
      this.optionHeight * this.visibleOptionsCount + 'px';
  }

  setOptionsContainerHeight(reset) {
    let optionsHeight;

    if (reset) {
      if (this.showAsPopup) {
        this.optionsCount = this.getOptionsCount();
        optionsHeight = this.getOptionsHeight();
        this.optionsHeight = optionsHeight;
      }
    } else {
      optionsHeight = this.optionsHeight;

      if (this.keepAlwaysOpen) {
        DomUtils.setStyle(this.$noOptions, 'height', optionsHeight);
        DomUtils.setStyle(this.$noSearchResults, 'height', optionsHeight);
      }
    }

    DomUtils.setStyle(this.$optionsContainer, 'max-height', optionsHeight);

    this.afterSetOptionsContainerHeight(reset);
  }

  setDropboxPosition() {
    if (this.position !== 'auto') {
      return;
    }

    let moreVisibleSides = DomUtils.getMoreVisibleSides(this.$wrapper, this);
    let showOnLeft = false;

    /** check that is dropbox hidden on right edge - only if custom width given */
    if (this.dropboxWidth) {
      let buttonCoords = this.$toggleButton.getBoundingClientRect();
      let viewportWidth = window.innerWidth;
      let dropboxWidth = parseFloat(this.dropboxWidth);
      let hiddenOnRight = buttonCoords.left + dropboxWidth > viewportWidth;
      let hiddenOnLeft = dropboxWidth > buttonCoords.right;

      if (hiddenOnRight && !hiddenOnLeft) {
        showOnLeft = true;
      }
    }

    if (this.appendToBody || this.appendTo !== null) {
      // BETA

      if (
        typeof screenfull !== 'undefined' &&
        screenfull.isFullscreen &&
        screenfull.element
      ) {
        let fragment = document.createDocumentFragment();
        fragment.appendChild(this.$dropboxContainer);
        screenfull.element.appendChild(fragment);
      } else {
        let fragment = document.createDocumentFragment();
        fragment.appendChild(this.$dropboxContainer);
        this.$body.appendChild(fragment);
      }

      if (this.appendTo) {
        const parentContainer = this.appendToParentContainer;
        const scrollableParent = this.$ele.closest('.scrollable');

        let eleCoords = {
          height: this.$ele.offsetHeight,
          left:
            this.$ele.offsetLeft +
            (parentContainer ? parentContainer.offsetLeft : 0),
          top:
            this.$ele.offsetTop +
            (parentContainer ? parentContainer.offsetTop : 0),
          width: this.$ele.offsetWidth,
        };

        let x = eleCoords.left - scrollableParent.scrollLeft;
        let y = eleCoords.top - scrollableParent.scrollTop;
        this.$dropboxEl.style.width = ''.concat(
          this.dropboxWidth
            ? parseFloat(this.dropboxWidth)
            : eleCoords.width + 2,
          'px'
        );
        this.$dropboxEl.style.left = ''.concat(x, 'px');

        if (moreVisibleSides.vertical === 'top') {
          this.$dropboxEl.style.top = ''.concat(
            y - this.$dropboxContainer.offsetHeight - 4,
            'px'
          );
        } else {
          //this.$dropboxEl.style.top = `${y + this.$ele.offsetHeight + 4}px`;
          this.$dropboxEl.style.top = ''.concat(y + eleCoords.height + 4, 'px');
        }
      } else {
        let eleCoords = this.$ele.getBoundingClientRect();
        let x = eleCoords.left + window.scrollX;
        let y = eleCoords.top + window.scrollY;

        this.$dropboxEl.style.width = `${
          this.dropboxWidth ? parseFloat(this.dropboxWidth) : eleCoords.width
        }px`;
        this.$dropboxEl.style.left = `${x}px`;

        if (moreVisibleSides.vertical === 'top') {
          let dropBoxCord = this.$dropboxContainer.getBoundingClientRect();

          // this.$dropboxEl.style.top = `${
          //   y - this.$dropboxContainer.offsetHeight - 4
          // }px`;
          this.$dropboxEl.style.top = `${y - dropBoxCord.height - 4}px`;
        } else {
          //this.$dropboxEl.style.top = `${y + this.$ele.offsetHeight + 4}px`;
          this.$dropboxEl.style.top = `${y + eleCoords.height + 4}px`;
        }
      }

      DomUtils.toggleClass(
        this.$dropboxContainer,
        'position-top',
        moreVisibleSides.vertical === 'top'
      );
      DomUtils.toggleClass(this.$dropboxContainer, 'position-left', showOnLeft);
    } else {
      DomUtils.toggleClass(
        this.$wrapper,
        'position-top',
        moreVisibleSides.vertical === 'top'
      );
      DomUtils.toggleClass(this.$wrapper, 'position-left', showOnLeft);
    }
  }

  setNewOption() {
    let value = this.searchValueOriginal.trim();

    if (!value) {
      return;
    }

    let newOption = this.getNewOption();

    if (newOption) {
      let newIndex = newOption.index;

      this.setOptionProp(newIndex, 'value', value);
      this.setOptionProp(newIndex, 'label', value);
    } else {
      let data = {
        value,
        label: value,
        isCurrentNew: true,
      };

      this.addOption(data);
    }
  }

  setSelectedProp() {
    let selectedValues = this.selectedValues;

    this.options.forEach((d) => {
      if (selectedValues.indexOf(d.value) !== -1) {
        d.isSelected = true;
      }
    });
  }
  /** set methods - end */

  /** get methods - start */
  getVisibleOptions() {
    return this.visibleOptions || [];
  }

  getValue() {
    return this.multiple ? this.selectedValues : this.selectedValues[0];
  }

  getFirstVisibleOptionIndex() {
    return Math.ceil(this.$optionsContainer.scrollTop / this.optionHeight);
  }

  getVisibleStartIndex() {
    let firstVisibleOptionIndex = this.getFirstVisibleOptionIndex();
    let startIndex = firstVisibleOptionIndex - this.halfOptionsCount;

    if (startIndex < 0) {
      startIndex = 0;
    }

    return startIndex;
  }

  getTooltipAttrText(text, ellipsisOnly = false, allowHtml = false) {
    let data = {
      'data-tooltip': text || '',
      'data-tooltip-enter-delay': this.tooltipEnterDelay,
      'data-tooltip-z-index': this.zIndex,
      'data-tooltip-font-size': this.tooltipFontSize,
      'data-tooltip-alignment': this.tooltipAlignment,
      'data-tooltip-max-width': this.tooltipMaxWidth,
      'data-tooltip-ellipsis-only': ellipsisOnly,
      'data-tooltip-allow-html': allowHtml,
    };

    return DomUtils.getAttributesText(data);
  }

  getOptionObj(data) {
    if (!data) {
      return;
    }

    let getString = Utils.getString;
    let newOption = {
      index: data.index,
      value: getString(data.value),
      label: getString(data.label),
      description: getString(data.description),
      alias: this.getAlias(data.alias),
      isCurrentNew: data.isCurrentNew || false,
      isVisible: true,
    };

    return newOption;
  }

  getNewOption() {
    let lastOption = this.options[this.lastOptionIndex];

    if (!lastOption || !lastOption.isCurrentNew) {
      return;
    }

    return lastOption;
  }

  getOptionIndex(value) {
    let index;

    if (value) {
      this.options.some((d) => {
        if (d.value == value) {
          index = d.index;

          return true;
        }
      });
    }

    return index;
  }

  getNewValue() {
    let newValues = this.newValues;
    let result = this.selectedValues.filter((d) => newValues.indexOf(d) !== -1);

    return this.multiple ? result : result[0];
  }

  getAlias(alias) {
    if (alias) {
      if (Array.isArray(alias)) {
        alias = alias.join(',');
      } else {
        alias = alias.toString().trim();
      }

      alias = alias.toLowerCase();
    } else {
      alias = '';
    }

    return alias;
  }

  getDisplayValue() {
    let displayValues = [];
    let selectedValues = this.selectedValues;

    for (let d of this.options) {
      if (selectedValues.indexOf(d.value) !== -1) {
        displayValues.push(d.label);
      }
    }

    return this.multiple ? displayValues : displayValues[0] || '';
  }

  getSelectedOptions() {
    let selectedValues = this.selectedValues;
    let selectedOptions = [];
    let valueKey = this.valueKey;
    let labelKey = this.labelKey;

    this.options.forEach((d) => {
      let isSelected = selectedValues.indexOf(d.value) !== -1;

      if (isSelected) {
        let data = {
          [valueKey]: d.value,
          [labelKey]: d.label,
        };

        if (d.isNew) {
          data.isNew = true;
        }

        selectedOptions.push(data);
      }
    });

    return this.multiple ? selectedOptions : selectedOptions[0];
  }

  getVisibleOptionGroupsMapping(searchValue) {
    let options = this.options;
    let result = {};
    let isOptionVisible = this.isOptionVisible;
    options = this.structureOptionGroup(options);

    options.forEach((d) => {
      result[d.index] = d.options.some(
        (e) => isOptionVisible(e, searchValue).isVisible
      );
    });

    return result;
  }

  getOptionsCount(count) {
    if (this.showAsPopup) {
      let availableHeight =
        (window.innerHeight * 80) / 100 - dropboxCloseButtonFullHeight;

      if (this.hasSearchContainer) {
        availableHeight -= searchHeight;
      }

      count = Math.floor(availableHeight / this.optionHeight);
    } else {
      count = parseInt(count);
    }

    return count;
  }

  getOptionsHeight() {
    return this.optionsCount * this.optionHeight + 'px';
  }

  getSibling($ele, direction) {
    let propName =
      direction === 'next' ? 'nextElementSibling' : 'previousElementSibling';

    do {
      if ($ele) {
        $ele = $ele[propName];
      }
    } while (
      DomUtils.hasClass($ele, 'disabled') ||
      DomUtils.hasClass($ele, 'group-title')
    );

    return $ele;
  }
  /** get methods - end */

  openDropbox(isSilent) {
    this.setDropboxPosition();
    DomUtils.removeClass(this.$wrapper, 'closed');
    DomUtils.removeClass(this.$dropboxEl, 'opened');

    setTimeout(() => {
      DomUtils.addClass(this.$wrapper, 'opened');
      DomUtils.addClass(this.$dropboxEl, 'opened');

      if (!isSilent) {
        this.moveSelectedOptionsFirst();
        DomUtils.addClass(this.$wrapper, 'focused');

        if (this.showAsPopup) {
          DomUtils.addClass(this.$body, 'vscomp-popup-active');
          this.isPopupActive = true;
        } else {
          this.focusSearchInput();
        }

        DomUtils.dispatchEvent(this.$ele, 'opened');
      }
    }, 0);
  }

  closeDropbox(isSilent) {
    if (this.keepAlwaysOpen) {
      this.removeOptionFocus();
      return;
    }

    let transitionDuration = isSilent ? 0 : this.transitionDuration;

    setTimeout(() => {
      DomUtils.removeClass(this.$wrapper, 'opened focused');
      DomUtils.removeClass(this.$dropboxEl, 'opened focused');

      this.removeOptionFocus();

      if (!isSilent) {
        if (this.isPopupActive) {
          DomUtils.removeClass(this.$body, 'vscomp-popup-active');
          this.isPopupActive = false;
        }

        DomUtils.dispatchEvent(this.$ele, 'closed');
      }
    }, 0);

    setTimeout(() => {
      DomUtils.addClass(this.$wrapper, 'closed');
      DomUtils.removeClass(this.$dropboxEl, 'closed');
      if (this.appendToBody || this.appendTo !== null) {
        // Hide dropbox somewhere farrrrrrr away
        this.$dropboxEl.style.left = `-2000px`;
        this.$dropboxEl.style.top = `-2000px`;
      }
    }, transitionDuration);
  }

  moveSelectedOptionsFirst() {
    if (!this.showSelectedOptionsFirst) {
      return;
    }

    this.setSortedOptions();

    if (!this.$optionsContainer.scrollTop || !this.selectedValues.length) {
      this.setVisibleOptions();
    } else {
      this.scrollToTop();
    }
  }

  toggleDropbox() {
    if (this.isOpened()) {
      this.closeDropbox();
    } else {
      this.openDropbox();
    }
  }

  isOpened() {
    return DomUtils.hasClass(this.$wrapper, 'opened');
  }

  focusSearchInput() {
    let $ele = this.$searchInput;

    if ($ele) {
      $ele.focus();
    }
  }

  focusOption(direction, ele) {
    let $focusedEle = this.$dropboxContainer.querySelector(
      '.vscomp-option.focused'
    );
    let $newFocusedEle;

    if (ele) {
      $newFocusedEle = ele;
    } else if (!$focusedEle) {
      /* if no element on focus choose first visible one */
      let firstVisibleOptionIndex = this.getFirstVisibleOptionIndex();
      $newFocusedEle = this.$dropboxContainer.querySelector(
        `.vscomp-option[data-visible-index="${firstVisibleOptionIndex}"]`
      );

      if (
        DomUtils.hasClass($newFocusedEle, 'disabled') ||
        DomUtils.hasClass($newFocusedEle, 'group-title')
      ) {
        $newFocusedEle = this.getSibling($newFocusedEle, 'next');
      }
    } else {
      $newFocusedEle = this.getSibling($focusedEle, direction);
    }

    if ($newFocusedEle && $newFocusedEle !== $focusedEle) {
      if ($focusedEle) {
        DomUtils.removeClass($focusedEle, 'focused');
      }

      DomUtils.addClass($newFocusedEle, 'focused');
      this.toggleFocusedProp(DomUtils.getData($newFocusedEle, 'index'), true);
      if (direction) this.moveFocusedOptionToView($newFocusedEle);
    }
  }

  moveFocusedOptionToView($focusedEle) {
    if (!$focusedEle) {
      $focusedEle = this.$dropboxContainer.querySelector(
        '.vscomp-option.focused'
      );
    }

    if (!$focusedEle) {
      return;
    }

    let newScrollTop;
    let containerRect = this.$optionsContainer.getBoundingClientRect();
    let optionRect = $focusedEle.getBoundingClientRect();
    let containerTop = containerRect.top;
    let containerBottom = containerRect.bottom;
    let containerHeight = containerRect.height;
    let optionTop = optionRect.top;
    let optionBottom = optionRect.bottom;
    let optionHeight = optionRect.height;
    let optionOffsetTop = $focusedEle.offsetTop;
    let optionsTop = DomUtils.getData(this.$options, 'top', 'number');

    /* if option hidden on top */
    if (containerTop > optionTop) {
      newScrollTop = optionOffsetTop + optionsTop;
    } else if (containerBottom < optionBottom) {
      /* if option hidden on bottom */
      newScrollTop =
        optionOffsetTop - containerHeight + optionHeight + optionsTop;
    }

    if (newScrollTop !== undefined) {
      this.$optionsContainer.scrollTop = newScrollTop;
    }
  }

  removeOptionFocus() {
    let $focusedEle = this.$dropboxContainer.querySelector(
      '.vscomp-option.focused'
    );

    if (!$focusedEle) {
      return;
    }

    DomUtils.removeClass($focusedEle, 'focused');
    this.toggleFocusedProp(null);
  }

  selectOption($ele) {
    if (!$ele) {
      return;
    }

    let isAdding = !DomUtils.hasClass($ele, 'selected');

    if (isAdding) {
      if (this.multiple && this.isMaxValuesSelected) {
        return;
      }
    } else {
      // On selection the same item select all
      if (
        this.slicerMode &&
        this.selectAllOnSingleItemClick &&
        this.selectedValues.length === 1
      ) {
        this.toggleAllOptions(true);
        return;
      }

      /** on selecting same value in single select */
      if (
        !this.multiple ||
        (this.slicerMode && this.selectedValues.length === 1)
      ) {
        this.closeDropbox();
        return;
      }
    }

    let selectedValues = this.selectedValues;
    let selectedIndexes = this.selectedIndexes;
    //let selectedValue = DomUtils.getData($ele, 'value');

    let selectedIndex = parseInt(DomUtils.getData($ele, 'index'));

    let selectedValue = this.options[selectedIndex].value;

    this.toggleSelectedProp(selectedIndex, isAdding);

    if (isAdding) {
      if (this.multiple) {
        selectedValues.push(selectedValue);
        selectedIndexes.push(selectedIndex);
        this.toggleAllOptionsClass();
      } else {
        if (selectedValues.length) {
          this.toggleSelectedProp(
            this.getOptionIndex(selectedValues[0]),
            false
          );
        }

        selectedValues = [selectedValue];
        selectedIndexes = [selectedIndex];
        let $prevSelectedOption = this.$ele.querySelector(
          '.vscomp-option.selected'
        );

        if ($prevSelectedOption) {
          DomUtils.toggleClass($prevSelectedOption, 'selected', false);
        }

        this.closeDropbox();
      }

      DomUtils.toggleClass($ele, 'selected');
    } else {
      if (this.multiple) {
        DomUtils.toggleClass($ele, 'selected');
        Utils.removeItemFromArray(selectedValues, selectedValue);
        Utils.removeItemFromArray(selectedIndexes, selectedIndex);
        this.toggleAllOptionsClass(false);
      }
    }

    if (DomUtils.hasClass($ele, 'current-new')) {
      this.beforeSelectNewValue();
    }

    this.setValue(selectedValues, selectedIndexes, true);
  }

  selectFocusedOption() {
    this.selectOption(
      this.$dropboxContainer.querySelector('.vscomp-option.focused')
    );
  }

  toggleAllOptions(isSelected, silentChange = false) {
    if (!this.multiple || (this.disableSelectAll && !this.slicerMode)) {
      return;
    }

    if (typeof isSelected !== 'boolean') {
      isSelected = !DomUtils.hasClass(this.$toggleAllCheckbox, 'checked');
    }

    let selectedValues = [];
    let selectedIndexes = [];
    let selectAllOnlyVisible = this.selectAllOnlyVisible;

    this.options.forEach((d, idx) => {
      if (d.isDisabled || d.isCurrentNew || d.isGroupTitle) {
        return;
      }

      if (!isSelected || (selectAllOnlyVisible && !d.isVisible)) {
        d.isSelected = false;
      } else {
        d.isSelected = true;

        selectedValues.push(d.value);

        if (!selectAllOnlyVisible || d.isVisible) {
          selectedIndexes.push(idx);
        }
      }
    });

    this.toggleAllOptionsClass(isSelected);
    this.toggleAddSearchClass(isSelected);
    this.setValue(selectedValues, selectedIndexes, !silentChange);
    this.renderOptions();
  }

  toggleAllOptionsClass(isAllSelected) {
    if (typeof isAllSelected !== 'boolean') {
      isAllSelected = false;

      if (this.options.length) {
        isAllSelected = !this.options.some((d) => {
          return !d.isSelected && !d.isDisabled && !d.isGroupTitle;
        });
      }
      var valuePassed = typeof isAllSelected === 'boolean';

      if (!valuePassed) {
        isAllSelected = this.isAllOptionsSelected();
      }
    }

    DomUtils.toggleClass(this.$toggleAllCheckbox, 'checked', isAllSelected);

    if (this.selectAllOnlyVisible && valuePassed) {
      this.isAllSelected = this.isAllOptionsSelected();
    } else {
      this.isAllSelected = isAllSelected;
    }
  }

  toggleAddSearchClass(isAllSelected) {
    // First, if the search returns no item, we can hide this section
    const visibleOptions = this.getVisibleOptions();

    DomUtils.toggleClass(
      this.$toggleAddSeachContainer,
      'hidden',
      !visibleOptions || !visibleOptions.length
    );

    if (typeof isAllSelected !== 'boolean') {
      isAllSelected = false;

      if (this.options.length) {
        isAllSelected = !this.options.some((d) => {
          return (
            d.isVisible && !d.isSelected && !d.isDisabled && !d.isGroupTitle
          );
        });
      }

      var valuePassed = typeof isAllSelected === 'boolean';

      if (!valuePassed) {
        isAllSelected = false;
      }
    }

    DomUtils.toggleClass(
      this.$toggleAddSeachCheckbox,
      'checked',
      isAllSelected
    );
  }

  isAllOptionsSelected() {
    let isAllSelected = false;

    if (this.options.length) {
      isAllSelected = !this.options.some((d) => {
        return !d.isSelected && !d.isDisabled && !d.isGroupTitle;
      });
    }

    return isAllSelected;
  }

  toggleFocusedProp(index, isFocused = false) {
    if (this.focusedOptionIndex) {
      this.setOptionProp(this.focusedOptionIndex, 'isFocused', false);
    }

    this.setOptionProp(index, 'isFocused', isFocused);
    this.focusedOptionIndex = index;
  }

  toggleSelectedProp(index, isSelected = false) {
    this.setOptionProp(index, 'isSelected', isSelected);
  }

  scrollToTop() {
    let isClosed = !this.isOpened();

    if (isClosed) {
      this.openDropbox(true);
    }

    let scrollTop = this.$optionsContainer.scrollTop;

    if (scrollTop > 0) {
      this.$optionsContainer.scrollTop = 0;
    }

    if (isClosed) {
      this.closeDropbox(true);
    }
  }

  reset() {
    this.options.forEach((d) => {
      d.isSelected = false;
    });

    this.beforeValueSet(true);
    this.setValue(null, null, true);
    this.afterValueSet();
  }

  beforeValueSet(isReset) {
    this.toggleAllOptionsClass(isReset ? false : undefined);
  }

  afterValueSet(doNotScrollToTop) {
    if (!doNotScrollToTop) {
      this.scrollToTop();
    }
    this.setSearchValue('');
    this.renderOptions();
  }

  afterSetOptions(keepValue, silentChange = false) {
    let search = this.searchValue; // Need to be stored because setValueMethod will empty this.searchValue

    if (keepValue) {
      if (this.isAllSelected) {
        this.toggleAllOptions(this.isAllSelected, silentChange); // If select all was on let select all on
      } else {
        this.setValueMethod(
          this.selectedValues,
          silentChange || this.silentInitialValueSet
        ); // Reselect valid values
      }

      if (this.search) this.setSearchValue(search, false, true);
    }

    this.setOptionsHeight();
    this.setVisibleOptions();

    if (!keepValue) {
      this.reset();
    }
  }

  addOption(data, rerender) {
    if (!data) {
      return;
    }

    this.lastOptionIndex++;
    data.index = this.lastOptionIndex;
    let newOption = this.getOptionObj(data);

    this.options.push(newOption);
    this.sortedOptions.push(newOption);

    if (rerender) {
      this.visibleOptionsCount++;
      this.afterSetOptions();
    }
  }

  removeOption(index) {
    if (!index && index != 0) {
      return;
    }

    this.options.splice(index, 1);
    this.lastOptionIndex--;
  }

  removeNewOption() {
    let newOption = this.getNewOption();

    if (newOption) {
      this.removeOption(newOption.index);
    }
  }

  beforeSelectNewValue() {
    let newOption = this.getNewOption();
    let newIndex = newOption.index;

    this.newValues.push(newOption.value);
    this.setOptionProp(newIndex, 'isCurrentNew', false);
    this.setOptionProp(newIndex, 'isNew', true);

    /** using setTimeout to fix the issue of dropbox getting closed on select */
    setTimeout(() => {
      this.setSearchValue('');
      this.focusSearchInput();
    }, 0);
  }

  sortOptions(options) {
    return options.sort((a, b) => {
      if (b.value === noneOptionValue && a.value !== noneOptionValue) {
        // None is always first
        return 0;
      } else if (!a.isSelected && !b.isSelected) {
        return 0;
      } else if (a.isSelected && (!b.isSelected || a.index < b.index)) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortOptionsGroup(options) {
    let sortOptions = this.sortOptions;
    options = this.structureOptionGroup(options);

    options.forEach((d) => {
      let childOptions = d.options;
      d.isSelected = childOptions.some((e) => e.isSelected);

      if (d.isSelected) {
        sortOptions(childOptions);
      }
    });

    sortOptions(options);

    return this.destructureOptionGroup(options);
  }

  isOptionVisible(d, searchValue, hasExactOption, visibleOptionGroupsMapping) {
    let value = d.label.toLowerCase();
    let description = d.description;
    let alias = d.alias;
    let isVisible = value.indexOf(searchValue) !== -1;

    if (d.isGroupTitle) {
      isVisible = visibleOptionGroupsMapping[d.index];
    }

    if (alias && !isVisible) {
      isVisible = alias.indexOf(searchValue) !== -1;
    }

    if (description && !isVisible) {
      isVisible = description.toLowerCase().indexOf(searchValue) !== -1;
    }

    d.isVisible = isVisible;

    if (!hasExactOption) {
      hasExactOption = value === searchValue;
    }

    return {
      isVisible,
      hasExactOption,
    };
  }

  structureOptionGroup(options) {
    let result = [];
    let childOptions = {};

    /** getting all group title */
    options.forEach((d) => {
      if (d.isGroupTitle) {
        let childArray = [];
        d.options = childArray;
        childOptions[d.index] = childArray;

        result.push(d);
      }
    });

    /** getting all group options */
    options.forEach((d) => {
      if (d.isGroupOption) {
        childOptions[d.groupIndex].push(d);
      }
    });

    return result;
  }

  destructureOptionGroup(options) {
    let result = [];

    options.forEach((d) => {
      result.push(d);
      result = result.concat(d.options);
    });

    return result;
  }

  serverSearch(searchValue) {
    DomUtils.removeClass(this.$wrapper, 'has-no-options');
    DomUtils.addClass(this.$wrapper, 'server-searching');
    this.setSelectedOptions();
    this.onServerSearch(searchValue, this);
  }

  /** static methods - start */
  static init(options) {
    let $eleArray = options.ele;

    if (!$eleArray) {
      return;
    }

    let singleEle = false;

    if (typeof $eleArray === 'string') {
      $eleArray = document.querySelector($eleArray);

      if (!$eleArray) {
        return;
      }
    }

    if ($eleArray.length === undefined) {
      $eleArray = [$eleArray];
      singleEle = true;
    }

    let instances = [];
    $eleArray.forEach(($ele) => {
      options.ele = $ele;
      instances.push(new VirtualSelect(options));
    });

    return singleEle ? instances[0] : instances;
  }

  static resetForm(e) {
    let $form = e.target.closest('form');

    if (!$form) {
      return;
    }

    $form.querySelectorAll('.vscomp-wrapper').forEach(($ele) => {
      $ele.parentElement.virtualSelect.reset();
    });
  }

  static reset() {
    this.virtualSelect.reset();
  }

  static renderOptions() {
    this.virtualSelect.renderOptions();
  }

  static setValueMethod(value, silentChange) {
    this.virtualSelect.setValueMethod(value, silentChange);
  }

  static setOptionsMethod(options, keepValue, silentChange = false) {
    this.virtualSelect.setOptionsMethod(options, keepValue, silentChange);
  }

  static setDisabledOptionsMethod(options) {
    this.virtualSelect.setDisabledOptionsMethod(options);
  }

  static toggleSelectAll(isSelected) {
    this.virtualSelect.toggleAllOptions(isSelected);
  }

  static isAllSelected() {
    return this.virtualSelect.isAllSelected;
  }

  static addOptionMethod(data) {
    this.virtualSelect.addOption(data, true);
  }

  static getNewValueMethod() {
    return this.virtualSelect.getNewValue();
  }

  static version() {
    return virtualSelectVersion;
  }

  static getDisplayValueMethod() {
    return this.virtualSelect.getDisplayValue();
  }

  static getSelectedOptionsMethod() {
    return this.virtualSelect.getSelectedOptions();
  }
  static openMethod() {
    return this.virtualSelect.openDropbox();
  }

  static closeMethod() {
    return this.virtualSelect.closeDropbox();
  }

  static setSearchValueMethod(value) {
    return this.virtualSelect.setSearchValue(value);
  }

  static onResizeMethod() {
    document.querySelectorAll('.vscomp-wrapper').forEach(($ele) => {
      $ele.parentElement.virtualSelect.onResize();
    });
  }
  /** static methods - end */
}

document.addEventListener('reset', VirtualSelect.resetForm);
window.addEventListener('resize', VirtualSelect.onResizeMethod);

window.VirtualSelect = VirtualSelect;

export class Utils {
  static getString(text) {
    return text || text === 0 ? text.toString() : '';
  }

  static convertToBoolean(value, defaultValue = false) {
    if (value === true || value === 'true') {
      value = true;
    } else if (value === false || value === 'false') {
      value = false;
    } else {
      value = defaultValue;
    }

    return value;
  }

  static isEmpty(value) {
    let result = false;

    if (!value) {
      result = true;
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        result = true;
      }
    } else if (typeof value === 'object') {
      if (Object.keys(value).length === 0) {
        result = true;
      }
    }

    return result;
  }

  static isNotEmpty(value) {
    return !this.isEmpty(value);
  }

  static removeItemFromArray(array, value, cloneArray) {
    if (
      !Array.isArray(array) ||
      !array.length ||
      typeof value === 'undefined'
    ) {
      return array;
    }

    if (cloneArray) {
      array = [...array];
    }

    let index = array.indexOf(value);

    if (index !== -1) {
      array.splice(index, 1);
    }

    return array;
  }

  static removeArrayEmpty(array) {
    if (!Array.isArray(array) || !array.length) {
      return [];
    }

    return array.filter((d) => !!d);
  }

  static generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}

export function isString(value) {
   return typeof value === 'string';
}

export function isDateTime(value) {
   return !Number.isNaN(Date.parse(value));
}

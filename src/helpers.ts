import { Observable } from 'rxjs';

export function getValue(property, callback) {
  if (property instanceof Observable) {
    property.subscribe(value => callback(value));
    return property;
  } else {
    return callback(property);
  }
}

import { Observable } from 'rxjs';

export function getValue(property: any, callback: any) {
  if (property instanceof Observable) {
    property.subscribe(value => callback(value));
    return property;
  } else {
    return callback(property);
  }
}

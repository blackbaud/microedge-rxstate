export class AsyncList<T> {
  constructor(public items: T[] = [], public lastUpdate: any = null, public loading: boolean = false, public count: number = items.length) {
  }
}

export class AsyncItem<T> {
  constructor(public item: T = <T>{}, public lastUpdate: any = null, public loading: boolean = false) {
  }
}

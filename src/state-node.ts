import { BehaviorSubject, zip } from 'rxjs';
import { StateDispatcher } from './state-dispatcher';

export class StateNode<T> extends BehaviorSubject<T> {
  private stateMap: { [stateKey: string]: any } = {};

  constructor(private initialState: T, private dispatcher: StateDispatcher<any>) {
    super(initialState);
  }

  register(stateKey: string, orchestrator: any) {
    this.stateMap[stateKey] = orchestrator;
    return this;
  }

  reset() {
    this.next(this.initialState);
  }

  begin() {
    let stateKeys: Array<string> = Object.keys(this.stateMap);
    let init: { [stateKey: string]: any } = this.initialState;
    let orchestrators = stateKeys.map(key => new (this.stateMap[key])().scan(init[key], this.dispatcher));

    zip
      .apply(this, orchestrators)
      .map((s: any) => {
        let result: any = <T>{};
        for (var i = 0; i < stateKeys.length; i++) {
          var key = stateKeys[i];
          result[key] = s[i];
        }

        return result;
      })
      .subscribe((s: any) => this.next(s));
  }
}

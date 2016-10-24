import { Observable, BehaviorSubject } from 'rxjs';
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
    let stateKeys = Object.keys(this.stateMap);
    let orchestrators = stateKeys.map(key => new (this.stateMap[key])().scan(this.initialState[key], this.dispatcher));

    Observable.zip
      .apply(this, orchestrators)
      .map(s => {
        let result = <T>{};
        for (var i = 0; i < stateKeys.length; i++) {
          var key = stateKeys[i];
          result[key] = s[i];
        }

        return result;
      })
      .subscribe(s => this.next(s));
  }
}

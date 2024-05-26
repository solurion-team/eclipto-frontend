import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";

export interface HomeState {

}

const initialState: HomeState = {

}

@Injectable()
export class HomeStore extends ComponentStore<HomeState> {
  constructor(

  ) {
    super(initialState);
  }


}

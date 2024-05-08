import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {WorkspaceClient} from "../data/workspace.client";

export interface HomeState {

}

const initialState: HomeState = {

}

@Injectable()
export class HomeStore extends ComponentStore<HomeState> {
  constructor(
    private readonly homeService: WorkspaceClient,
  ) {
    super(initialState);
  }


}

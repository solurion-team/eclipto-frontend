import {ComponentStore} from "@ngrx/component-store";
import {Injectable} from "@angular/core";
import {ProjectCardState} from "./project-card/project-card.component";
import {concatMap, exhaustMap, finalize, Observable, tap} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {HttpErrorResponse} from "@angular/common/http";

export interface SidebarState {
  projectCards: ProjectCardState[];
  isActive: boolean;
}

@Injectable()
export class SidebarStore extends ComponentStore<SidebarState> {
  constructor() {
    super({ projectCards: [], isActive: false });
  }

  readonly projectCards$ = this.select(state => state.projectCards);
  readonly isActive$ = this.select(state => state.isActive);

  readonly addEditingProject = this.updater((state) => ({
    ...state,
    projectCards: [...state.projectCards, {isEditing: true, isSelected: true}]
  }));

  readonly removeProjectCard = this.updater((state, index: number) => ({
    ...state,
    projectCards: state.projectCards.filter((_, cardIndex) => cardIndex !== index)
  }));

  readonly toggleActive = this.updater((state) => ({
    ...state,
    isActive: !state.isActive
  }));
}

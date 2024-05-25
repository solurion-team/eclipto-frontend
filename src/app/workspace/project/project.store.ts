import {ComponentStore} from "@ngrx/component-store";
import {WorkspaceState} from "../workspace.store";
import {exhaustMap, Observable, tap} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {ProjectCardState} from "../sidebar/project-card/project-card.component";
import {HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ProjectService} from "../../client/api/project.service";

enum ProjectRoute {
  Board = "board",
  Calendar = "calendar",
  TaskList = "task-list",
  Settings = "settings",
}

export interface ProjectState {
  readonly id?: number;
  readonly name?: string;
  readonly tint?: string;
  readonly isLoaded: boolean;
  readonly isError: boolean;
}

const initialState: ProjectState = {
  isLoaded: false, isError: false
}

@Injectable()
export class ProjectStore extends ComponentStore<ProjectState> {
  constructor(private readonly projectService: ProjectService) {
    super(initialState);
  }
  readonly id$ = this.select(state => state.id);
  readonly name$ = this.select(state => state.name);
  readonly tint$ = this.select(state => state.tint);
  readonly isLoaded$ = this.select(state => state.isLoaded);

  readonly loadProject = this.effect((projectId$: Observable<number>) => {
    return projectId$.pipe(
      tap(_ => this.setState(() => ({isLoaded: false, isError: false}))),
      exhaustMap((projectId) => this.projectService.getProjectInfo(projectId).pipe(
        tapResponse(
          (projectInfoDto) => {
            this.patchState((state) => {
              return {id: projectId, name: projectInfoDto.name, tint: projectInfoDto.tint, isLoaded: true}
            })
          },
          (error: HttpErrorResponse) => {
            this.patchState((state) =>
              ({isError: true})
            )
          }
        )
      ))
    )
  })
}

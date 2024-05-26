import {Injectable, OnDestroy} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {exhaustMap, Observable, of, Subject, tap, withLatestFrom} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {ProjectCardState} from "../workspace/sidebar/project-card/project-card.component";
import {HttpErrorResponse} from "@angular/common/http";
import {TaskStatusContainer} from "../workspace/project/board/board.store";
import {CredentialsService} from "../data/credentials.service";
import {AddTaskStatusData} from "../workspace/project/board/add-task-status-dialog/add-task-status-dialog.component";
import {WorkspaceService} from "../client/api/workspace.service";

export interface HomeState {
  isLoading: boolean,
  isError: boolean,
  workspaceCarsStates: WorkspaceCardState[]
}

export interface WorkspaceCardState {
  id: number,
  name: string,
  description?: string,
  ownerName: string
}

export interface WorkspaceData {
  name: string
  description?: string
  ownerId: number
}

const initialState: HomeState = {
  isLoading: true,
  isError: false,
  workspaceCarsStates: []
}

@Injectable()
export class HomeStore extends ComponentStore<HomeState> implements OnDestroy {
  private http: any;
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly credentialsService: CredentialsService
  ) {
    super(initialState);
  }

  private readonly _navigateToWorkspaceEvent$: Subject<number> = new Subject<number>();

  public get navigateToWorkspaceEvent(): Observable<number> {
    return this._navigateToWorkspaceEvent$.asObservable()
  }

  readonly isLoading$ = this.select(state => state.isLoading);
  readonly isError$ = this.select(state => state.isError);
  readonly workspaceCarsStates$ = this.select(state => state.workspaceCarsStates);


  readonly loadHome = this.effect<void>((trigger$) =>
    trigger$.pipe(
      exhaustMap((_ ) => {
        this.patchState({
          isLoading: false,
          workspaceCarsStates: [
            {id: 1, name: "Eclipto", description: "Some description", ownerName: "pasdkfpasdokf"},
            {id: 2, name: "Workssp", description: "aaaaaaaaaaaaaaaaaaaaaaaaaaaa", ownerName: "Me"},
            {id: 3, name: "asdfsdfds", description: "123123123123", ownerName: "11111"},
            {id: 4, name: "uuuuuu", description: "d", ownerName: "1"},
            {id: 5, name: "NotEclipto", description: "Not Some description", ownerName: "nopt pasdkfpasdokf"}
          ]
        })

        return of()
      })
    )
  )

  readonly createWorkspace = this.effect((workspaceData$: Observable<WorkspaceData>) => {
    return workspaceData$.pipe(
      exhaustMap((workspaceData) => {
        this.patchState((state) => ({
          workspaceCarsStates: [
            ...state.workspaceCarsStates,
            {id: state.workspaceCarsStates.length + 1, name: workspaceData.name, description: workspaceData.description, ownerName: "sdfsdf"}
          ]
        }))
        return of()
      })
    )
  })

  // readonly addWorkspace = this.effect((workspaceData$: Observable<WorkspaceData>) => {
  //   return workspaceData$.pipe(
  //     exhaustMap((taskStatusData) => this.taskService.postTaskStatus({
  //       name: taskStatusData.name,
  //       tint: taskStatusData.tint,
  //       project_id: projectId!
  //     }).pipe(
  //       tapResponse(
  //         (taskStatusDto) => {
  //           const taskStatusContainer = this.mapToTaskStatusContainer(taskStatusDto)
  //           this.patchState((state) =>
  //             ({isLoading: false, taskStatuses: [...state.taskStatuses, taskStatusContainer]})
  //           )
  //         },
  //         (error: HttpErrorResponse) => {
  //           this.patchState((state) => ({isError: true}))
  //         }
  //       )
  //     ))
  //   )
  // })

  navigateToWorkspace(id: number) {
    this._navigateToWorkspaceEvent$.next(id)
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this._navigateToWorkspaceEvent$.complete()
  }
  deleteWorkspace(id: number): void {
    this.workspaceService.deleteWorkspace(id).subscribe(() => {
      this.patchState(state => ({
        workspaceCarsStates: state.workspaceCarsStates.filter(workspace => workspace.id !== id)
      }));
    });
  }
}

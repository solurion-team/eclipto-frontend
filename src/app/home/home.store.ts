import {Injectable, OnDestroy} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {mergeMap, Observable, of, Subject, tap, withLatestFrom} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {ProjectCardState} from "../workspace/sidebar/project-card/project-card.component";
import {HttpErrorResponse} from "@angular/common/http";
import {TaskStatusContainer} from "../workspace/project/board/board.store";
import {CredentialsService} from "../data/credentials.service";
import {AddTaskStatusData} from "../workspace/project/board/add-task-status-dialog/add-task-status-dialog.component";
import {WorkspaceService} from "../client/api/workspace.service";
import {WorkspaceExtendedDto} from "../client/model/workspaceExtendedDto";

export interface HomeState {
  isLoading: boolean,
  isError: boolean,
  workspaceCarsStates: WorkspaceCardState[]
}

export interface WorkspaceCardState {
  id: number,
  name: string,
  description?: string | null,
  ownerName: string
}

export interface WorkspaceData {
  name: string
  description?: string | null
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
      mergeMap(() => this.workspaceService.getWorkspaces().pipe(
        tapResponse(
          (workspaceExtendedDtos) => {
            const projectCardStates = workspaceExtendedDtos.map<WorkspaceCardState>((dto) => this.mapToWorkspaceCardState(dto))
            this.patchState((state) =>
              ({isLoading: false, workspaceCarsStates: projectCardStates})
            )
          },
          (error: HttpErrorResponse) => {
            console.log(error)
          }
        )
      ))
    )
  )

  readonly createWorkspace = this.effect((workspaceData$: Observable<WorkspaceData>) => {
    return workspaceData$.pipe(
      mergeMap((workspaceData) =>
        this.workspaceService.createWorkspace({
          name: workspaceData.name,
          description: workspaceData.description
        }).pipe(
          tapResponse(
            (workspaceDto) => {
              this.patchState((state) => ({
                workspaceCarsStates: [...state.workspaceCarsStates, this.mapToWorkspaceCardState(workspaceDto)]
              }))
            },
            (error: HttpErrorResponse) => {
              console.log(error)
            }
          )
        )
      )
    )
  })

  readonly deleteWorkspace = this.effect((workspaceId$: Observable<number>) => {
    return workspaceId$.pipe(
      mergeMap((workspaceId) =>
        this.workspaceService.deleteWorkspace(workspaceId).pipe(
          tapResponse(
            () => {
              this.patchState(state => ({
                workspaceCarsStates: state.workspaceCarsStates.filter(workspace => workspace.id !== workspaceId)
              }));
            },
            (error: HttpErrorResponse) => {
              console.log(error)
            }
          )
        )
      )
    )
  })

  navigateToWorkspace(id: number) {
    this._navigateToWorkspaceEvent$.next(id)
  }

  mapToWorkspaceCardState(workspaceExtendedDto: WorkspaceExtendedDto): WorkspaceCardState {
    return {
      id: workspaceExtendedDto.id,
      name: workspaceExtendedDto.name,
      description: workspaceExtendedDto.description,
      ownerName: workspaceExtendedDto.owner.first_name + " " + workspaceExtendedDto.owner.last_name
    };
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this._navigateToWorkspaceEvent$.complete()
  }
}

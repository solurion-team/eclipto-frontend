import {Injectable, OnDestroy} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {SidebarState} from "./sidebar/sidebar.component";
import {mergeMap, finalize, Observable, Subject, tap, withLatestFrom} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {ProjectCardState} from "./sidebar/project-card/project-card.component";
import {ProjectService} from "../client/api/project.service";
import {CredentialsService} from "../data/credentials.service";

export interface WorkspaceState {
  readonly id?: number,
  readonly sidebarState: SidebarState;
  readonly currentProjectId?: number;
}

const initialState: WorkspaceState = {
  sidebarState: {projectCards: [], isActive: true, isLoading: false},
}

@Injectable()
export class WorkspaceStore extends ComponentStore<WorkspaceState> implements OnDestroy {
  constructor(private readonly projectService: ProjectService, private readonly credentialsService: CredentialsService) {
    super(initialState);
  }
  private readonly _openAddProjectDialogEvent$: Subject<void> = new Subject<void>();

  public get openAddProjectDialogEvent$(): Observable<void> {
    return this._openAddProjectDialogEvent$.asObservable()
  }

  readonly sidebarState$ = this.select(state => state.sidebarState);
  readonly currentProjectId$ = this.select(state => state.currentProjectId);
  readonly isSidebarActive$ = this.select(state => state.sidebarState.isActive);

  readonly toggleActive = this.updater((state) => ({
    ...state,
    sidebarState: {...state.sidebarState, isActive: !state.sidebarState.isActive}
  }));

  readonly openProject = this.updater((state, projectId: number) => ({
    ...state,
    currentProjectId: projectId,
    sidebarState: {
      ...state.sidebarState,
      projectCards: state.sidebarState.projectCards.map((projectState) => (
        projectState.id === projectId ? { ...projectState, isSelected: true } : projectState
      ))
    }
  }));

  readonly loadWorkspace = this.effect((workspaceId$: Observable<number>) => {
    return workspaceId$.pipe(
      mergeMap((workspaceId) => this.projectService.getProjects(workspaceId).pipe(
        tapResponse(
          (projectInfoDtos) => {
            const projectCardStates = projectInfoDtos.map<ProjectCardState>((projectInfo) => {
              return {...projectInfo, iconColor: projectInfo.tint, isSelected: false}
            })
            this.patchState((state) =>
              ({id: workspaceId, sidebarState: {...state.sidebarState, projectCards: projectCardStates, isLoading: false}})
            )
          },
          (error: HttpErrorResponse) => {
            console.log(error)
          }
        )
      ))
    )
  })

  readonly createProject = this.effect((projectData$: Observable<{name: string, description: string}>) => {
    return projectData$.pipe(
      withLatestFrom(this.select(state => state.id!)),
      mergeMap(([projectData, workspaceId]) =>
        this.projectService.postProject({
          name: projectData.name,
          description: projectData.description,
          lead_id: this.credentialsService.userId,
          workspace_id: workspaceId,
        }).pipe(
          tapResponse(
            (projectInfoDto) => {
              this.patchState((state) => ({
                sidebarState: {
                  ...state.sidebarState,
                  projectCards: [...state.sidebarState.projectCards, {...projectInfoDto, iconColor: projectInfoDto.tint, isSelected: false}]
                }})
              )
              this.openProject(projectInfoDto.id)
            },
            (error: HttpErrorResponse) => {
              console.log(error)
            }
          )
        )
      )
    )
  })

  openAddProjectDialog() {
    this._openAddProjectDialogEvent$.next()
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this._openAddProjectDialogEvent$.complete()
  }
}

import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {SidebarState} from "./sidebar/sidebar.component";
import {ProjectClient} from "../data/project.client";
import {exhaustMap, finalize, Observable, tap, withLatestFrom} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {ProjectCardState} from "./sidebar/project-card/project-card.component";

export interface WorkspaceState {
  readonly id?: number,
  readonly sidebarState: SidebarState;
  readonly isAddProjectDialogActive: boolean,
  readonly currentProjectId?: number;
}

const initialState: WorkspaceState = {
  sidebarState: {projectCards: [], isActive: true, isLoading: false},
  isAddProjectDialogActive: false,
}

@Injectable()
export class WorkspaceStore extends ComponentStore<WorkspaceState> {
  constructor(private readonly projectClient: ProjectClient) {
    super(initialState);
  }

  readonly sidebarState$ = this.select(state => state.sidebarState);
  readonly currentProjectId$ = this.select(state => state.currentProjectId);
  readonly isSidebarActive$ = this.select(state => state.sidebarState.isActive);
  readonly isAddProjectDialogActive$ = this.select(state => state.isAddProjectDialogActive);

  readonly toggleActive = this.updater((state) => ({
    ...state,
    sidebarState: {...state.sidebarState, isActive: !state.sidebarState.isActive}
  }));

  readonly setIsAddNewProjectDialogActive = this.updater((state, isActive: boolean) => ({
    ...state,
    isAddProjectDialogActive: true
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
      exhaustMap((workspaceId) => this.projectClient.getProjects(workspaceId).pipe(
        tapResponse(
          (projectInfoDtos) => {
            const projectCardStates = projectInfoDtos.map<ProjectCardState>((projectInfo) => {
              return {...projectInfo, iconColor: "blue", isSelected: false}
            })
            this.patchState((state) =>
              ({sidebarState: {...state.sidebarState, projectCards: projectCardStates, isLoading: false}})
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
      exhaustMap(([projectData, workspaceId]) =>
        this.projectClient.createProject({...projectData, lead_id:1, workspace_id: workspaceId}).pipe(
          tapResponse(
            (projectInfoDto) => {
              this.patchState((state) => ({
                sidebarState: {
                  ...state.sidebarState,
                  projectCards: [...state.sidebarState.projectCards, {...projectInfoDto, iconColor: "blue", isSelected: false}]
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

  // readonly login = this.effect((credentials$: Observable<{email: string, password: string}>) => {
  //   return credentials$.pipe(
  //     tap((credentials) => this.patchState({...credentials, isLoading: true, isError: false})),
  //     exhaustMap((credentials) => this.loginService.login(credentials).pipe(
  //       finalize(() => this.patchState({isLoading: false})),
  //       tapResponse(
  //         (response) => {
  //           this.cookieService.set("access_token", response.access_token, {secure: true, sameSite: "Strict"})
  //           this.patchState({isLoginCompleted: true})
  //         },
  //         (error: HttpErrorResponse) => {
  //           this.patchState({password: "", isError: true})
  //         }
  //       ),
  //     )),
  //   );
  // });
}

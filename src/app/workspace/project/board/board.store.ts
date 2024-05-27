import {Injectable, OnDestroy} from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import {EMPTY, exhaustMap, Observable, Subject, tap, withLatestFrom} from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { UserIconState } from "../../../common/user-icon/user-icon.component";
import { ProjectStore } from "../project.store";
import {TaskData, UpdateTaskData} from "./add-task-dialog/add-task-dialog.component";
import { AddTaskStatusData } from "./add-task-status-dialog/add-task-status-dialog.component";
import { TaskService } from "../../../client/api/task.service";
import { CredentialsService } from "../../../data/credentials.service";
import { TaskStatusDto } from "../../../client/model/taskStatusDto";
import { TaskLiteDto } from "../../../client/model/taskLiteDto";
import { Priority } from "../../../client/model/priority";
import {TaskInfoDto} from "../../../client/model/taskInfoDto";

export interface BoardState {
  readonly taskStatuses: TaskStatusContainer[]
  readonly isLoading: boolean;
  readonly isError: boolean;
}

export interface TaskStatusContainer {
  readonly id: number,
  readonly name: string;
  readonly tint: string;
  readonly tasks: TaskCard[];
}

export interface TaskCard {
  readonly id: number,
  readonly title: string;
  readonly priority: string;
  readonly isCompleted: boolean;
  readonly assignedUser?: UserIconState
}

const initialState: BoardState = {
  taskStatuses: [], isLoading: true, isError: false
}

@Injectable()
export class BoardStore extends ComponentStore<BoardState> implements OnDestroy {
  constructor(
    private readonly taskService: TaskService,
    private readonly projectStore: ProjectStore,
    private readonly credentialsService: CredentialsService
  ) {
    super(initialState);
  }

  private readonly _taskDataLoadedEvent$: Subject<TaskData> = new Subject<TaskData>();
  public get taskDataLoadedEvent$(): Observable<TaskData> {
    return this._taskDataLoadedEvent$.asObservable()
  }

  readonly taskStatuses$ = this.select(state => state.taskStatuses);
  readonly isLoading$ = this.select(state => state.isLoading);
  readonly isError$ = this.select(state => state.isError);

  readonly loadBoard = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.projectStore.id$),
      exhaustMap(([_, projectId]) => this.taskService.getProjectTaskStatuses(projectId!, true).pipe(
        tapResponse(
          (taskStatusDtos) => {
            const taskStatuses = taskStatusDtos.map<TaskStatusContainer>(dto => this.mapToTaskStatusContainer(dto))
            this.patchState((state) =>
              ({taskStatuses: taskStatuses, isLoading: false})
            )
          },
          (error: HttpErrorResponse) => {
            this.patchState((state) => ({isError: true}))
          }
        )
      ))
    )
  )

  readonly addTaskStatus = this.effect((taskStatusData$: Observable<AddTaskStatusData>) => {
    return taskStatusData$.pipe(
      withLatestFrom(this.projectStore.id$),
      exhaustMap(([taskStatusData, projectId]) => this.taskService.postTaskStatus({
        name: taskStatusData.name,
        tint: taskStatusData.tint,
        project_id: projectId!
      }).pipe(
        tapResponse(
          (taskStatusDto) => {
            const taskStatusContainer = this.mapToTaskStatusContainer(taskStatusDto)
            this.patchState((state) =>
              ({isLoading: false, taskStatuses: [...state.taskStatuses, taskStatusContainer]})
            )
          },
          (error: HttpErrorResponse) => {
            this.patchState((state) => ({isError: true}))
          }
        )
      ))
    )
  })

  readonly addTask = this.effect((taskData$: Observable<TaskData>) => {
    return taskData$.pipe(
      withLatestFrom(this.projectStore.id$, this.state$),
      exhaustMap(([taskData, projectId, state]) => this.taskService.postTask({
        title: taskData.title,
        description: taskData.description,
        index: 1,
        status_id: taskData.taskStatusId,
        index: 1,
        priority: taskData.priority,
        due_date: taskData.date ? taskData.date.toISOString() : null,
        reporter_user_id: this.credentialsService.userId,
        project_id: projectId!,
        // isCompleted: taskData.isCompleted,
      }).pipe(
        tapResponse(
          (taskLiteDto) => {
            const addedTaskCard = this.mapToTaskCard(taskLiteDto)
            this.patchState((state) =>
              ({
                taskStatuses: state.taskStatuses.map(container =>
                  container.id === taskData.taskStatusId
                    ? { ...container, tasks: [...container.tasks, addedTaskCard] }
                    : container
                )
              })
            )
          },
          (error: HttpErrorResponse) => {
            this.patchState((state) => ({isError: true}))
          }
        )
      ))
    )
  })

  readonly loadTaskData = this.effect((taskId$: Observable<number>) => {
    return taskId$.pipe(
      exhaustMap((taskId) => this.taskService.getTask(taskId).pipe(
        tapResponse(
          (taskInfoDto) => {
            this._taskDataLoadedEvent$.next(this.mapToTaskData(taskInfoDto))
          },
          (error: HttpErrorResponse) => {
            this.patchState((state) => ({isError: true}))
          }
        )
      ))
    )
  })

  readonly updateTask = this.effect((taskData$: Observable<UpdateTaskData>) => {
    return taskData$.pipe(
      exhaustMap((taskData) => this.taskService.updateTask(taskData.id!, {
        title: taskData.title,
        description: taskData.description,
        status_id: taskData.taskStatusId,
        priority: taskData.priority,
        due_date: taskData.date ? taskData.date.toISOString() : null,
        assigned_user_id: taskData.assignedUserId,
        is_completed: taskData.isCompleted
      }).pipe(
        tapResponse(
          (taskInfoDto) => {
            this.patchState((state) =>
              ({
                taskStatuses: state.taskStatuses.map(container =>
                  container.id === taskData.taskStatusId ?
                    {
                      ...container,
                      tasks: container.tasks.map(task => task.id === taskData.id! ? this.mapInfoToTaskCard(taskInfoDto) : task)
                    }
                    : container
                )
              })
            )
          },
          (error: HttpErrorResponse) => {
            this.patchState((state) => ({isError: true}))
          }
        )
      ))
    )
  })

  readonly deleteTask = this.effect((taskId$: Observable<{taskStatusId: number, taskId: number}>) => {
    return taskId$.pipe(
      exhaustMap((deleteTaskData) => this.taskService.deleteTask(deleteTaskData.taskId).pipe(
        tapResponse(
          (_) => {
            this.patchState((state) =>
              ({
                taskStatuses: state.taskStatuses.map(container =>
                  container.id === deleteTaskData.taskStatusId ?
                    {
                      ...container,
                      tasks: container.tasks.filter(task => task.id !== deleteTaskData.taskId)
                    }
                    : container
                )
              })
            )
          },
          (error: HttpErrorResponse) => {
            this.patchState((state) => ({isError: true}))
          }
        )
      ))
    )
  })


  private mapToTaskStatusContainer(taskStatusDto: TaskStatusDto): TaskStatusContainer {
    return {
      id: taskStatusDto.id,
      name: taskStatusDto.name,
      tint: taskStatusDto.tint,
      tasks: taskStatusDto.tasks ? taskStatusDto.tasks.map<TaskCard>(e => this.mapToTaskCard(e)) : []
    }
  }

  private mapToTaskCard(taskLiteDto: TaskLiteDto): TaskCard {
    return {
      id: taskLiteDto.id,
      title: taskLiteDto.title,
      isCompleted: taskLiteDto.is_completed,
      priority: taskLiteDto.priority
    }
  }

  private mapInfoToTaskCard(taskInfoDto: TaskInfoDto): TaskCard {
    return {
      id: taskInfoDto.id,
      title: taskInfoDto.title,
      isCompleted: taskInfoDto.is_completed,
      priority: taskInfoDto.priority
    }
  }

  private mapToTaskData(taskInfoDto: TaskInfoDto): TaskData {
    return {
      id: taskInfoDto.id,
      title: taskInfoDto.title,
      description: taskInfoDto.description,
      isCompleted: taskInfoDto.is_completed,
      priority: taskInfoDto.priority,
      assignedUserId: taskInfoDto.assigned_user_id,
      taskStatusId: taskInfoDto.status.id,
      date: taskInfoDto.due_date ? new Date(taskInfoDto.due_date) : undefined,
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this._taskDataLoadedEvent$.complete()
  }
}

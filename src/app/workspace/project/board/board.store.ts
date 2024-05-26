import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import {EMPTY, exhaustMap, Observable, Subject, tap, withLatestFrom} from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { UserIconState } from "../../../common/user-icon/user-icon.component";
import { ProjectStore } from "../project.store";
import { AddTaskData } from "./add-task-dialog/add-task-dialog.component";
import { AddTaskStatusData } from "./add-task-status-dialog/add-task-status-dialog.component";
import { TaskService } from "../../../client/api/task.service";
import { CredentialsService } from "../../../data/credentials.service";
import { TaskStatusDto } from "../../../client/model/taskStatusDto";
import { TaskLiteDto } from "../../../client/model/taskLiteDto";
import { Priority } from "../../../client/model/priority";

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
  readonly assignedUser?: UserIconState
}

const initialState: BoardState = {
  taskStatuses: [], isLoading: true, isError: false
}

@Injectable()
export class BoardStore extends ComponentStore<BoardState> {
  constructor(
    private readonly taskService: TaskService,
    private readonly projectStore: ProjectStore,
    private readonly credentialsService: CredentialsService
  ) {
    super(initialState);
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

  readonly addTask = this.effect((taskData$: Observable<AddTaskData>) => {
    return taskData$.pipe(
      withLatestFrom(this.projectStore.id$, this.state$),
      exhaustMap(([taskData, projectId, state]) => this.taskService.postTask({
        title: taskData.title,
        index: 1,
        status_id: taskData.taskStatusId,
        priority: taskData.priority,
        reporter_user_id: this.credentialsService.userId,
        project_id: projectId!
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

  readonly loadTaskById = (taskId: number): Observable<TaskCard> => {
    return this.taskService.getTask(taskId).pipe(
      tapResponse(
        (task) => task,
        (error: HttpErrorResponse) => {
          console.error('Error loading task', error);
          return EMPTY;
        }
      )
    );
  };


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
      priority: taskLiteDto.priority
    }
  }
}

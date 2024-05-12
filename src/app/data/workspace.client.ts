import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {TokenService} from "./token.service";
import {AuthService} from "./auth.service";


export interface WorkspaceInfoDto {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkspaceClient {
  readonly API_URL = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {

  }

  getWorkspace(workspaceId: string): Observable<WorkspaceInfoDto> {
    return this.http.get<WorkspaceInfoDto>(`${this.API_URL}/v1/workspaces/${workspaceId}`, {
      headers: this.authService.authHeader
    });
  }

  updateWorkspace(workspaceId: string, workspaceData: WorkspaceInfoDto): Observable<WorkspaceInfoDto> {
    return this.http.put<WorkspaceInfoDto>(`${this.API_URL}/v1/workspaces/${workspaceId}`, workspaceData, {
      headers: this.authService.authHeader
    });
  }

  deleteWorkspace(workspaceId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/v1/workspaces/${workspaceId}`, {
      headers: this.authService.authHeader,
    });
  }

  createWorkspace(workspaceData: WorkspaceInfoDto): Observable<WorkspaceInfoDto> {
    return this.http.post<WorkspaceInfoDto>(`${this.API_URL}/v1/workspaces`, workspaceData, {
      headers: this.authService.authHeader
    });
  }
}
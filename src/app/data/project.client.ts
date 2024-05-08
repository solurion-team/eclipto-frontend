import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

export interface ProjectInfoDto {
  id: number;
  name: string;
  description?: string;
  lead_id: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  workspace_id: number;
  lead_id: number;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  lead_id?: number;
}


@Injectable({
  providedIn: 'root'
})
export class ProjectClient {
  private readonly API_URL = 'http://localhost:8082';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProject(projectId: string): Observable<ProjectInfoDto> {
    return this.http.get<ProjectInfoDto>(`${this.API_URL}/v1/projects/${projectId}`, {
      headers: this.authService.authHeader
    });
  }

  updateProject(projectId: string, projectData: UpdateProjectRequest): Observable<ProjectInfoDto> {
    return this.http.put<ProjectInfoDto>(`${this.API_URL}/v1/projects/${projectId}`, projectData, {
      headers: this.authService.authHeader
    });
  }

  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/v1/projects/${projectId}`, {
      headers: this.authService.authHeader
    });
  }

  createProject(projectData: CreateProjectRequest): Observable<ProjectInfoDto> {
    return this.http.post<ProjectInfoDto>(`${this.API_URL}/v1/projects`, projectData, {
      headers: this.authService.authHeader
    });
  }

  getProjects(workspaceId?: number): Observable<ProjectInfoDto[]> {
    const params = new HttpParams();
    if (workspaceId) {
      params.set("workspaceId", workspaceId);
    }
    return this.http.get<ProjectInfoDto[]>(`${this.API_URL}/v1/projects`, {
      headers: this.authService.authHeader,
      params: params
    });
  }
}


import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {WorkspaceService} from "../workspace.service";
import {WorkspaceStore} from "../workspace.store";
import {AsyncPipe} from "@angular/common";
import {ProjectStore} from "./project.store";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {provideComponentStore} from "@ngrx/component-store";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe, MatProgressSpinner],
  providers: [provideComponentStore(ProjectStore)],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  readonly isSidebarActive$ = this.workspaceStore.isSidebarActive$
  readonly name$ = this.projectStore.name$;
  readonly tint$ = this.projectStore.tint$;
  readonly isLoaded$ = this.projectStore.isLoaded$;

  constructor(
    private readonly workspaceStore: WorkspaceStore,
    private readonly projectStore: ProjectStore,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params =>
      this.projectStore.loadProject(params["id"])
    )
    this.isLoaded$.subscribe({
      next: value => value && this.router.navigate([`./board`], {relativeTo: this.route}).then()
    })
  }
}

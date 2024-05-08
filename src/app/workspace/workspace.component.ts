import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {ProjectComponent} from "./project/project.component";
import {AddProjectDialogComponent} from "./add-project-dialog/add-project-dialog.component";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {provideComponentStore} from "@ngrx/component-store";
import {WorkspaceStore} from "./workspace.store";
import {AsyncPipe} from "@angular/common";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    SidebarComponent, ProjectComponent, RouterOutlet, AddProjectDialogComponent, AsyncPipe
  ],
  providers: [provideComponentStore(WorkspaceStore)],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent implements OnInit {
  readonly sidebarState$ = this.workspaceStore.sidebarState$
  private dialogRef?: MatDialogRef<AddProjectDialogComponent>

  constructor(
    private readonly workspaceStore: WorkspaceStore,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params =>
      this.workspaceStore.loadWorkspace(params["id"])
    )
    this.workspaceStore.currentProjectId$.subscribe({
      next: value => value && this.router.navigate([`./project/${value}`], {relativeTo: this.route}).then(r => {
      })
    })
    this.workspaceStore.openAddProjectDialogEvent$.subscribe({
      next: _ => this.openAddProjectDialog()
    })
  }

  private openAddProjectDialog() {
    this.dialogRef = this.dialog.open(AddProjectDialogComponent, {
      height: '400px',
      width: '600px',
    });
    this.dialogRef.afterClosed().subscribe(result => result && this.workspaceStore.createProject(result))
  }
}


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HomeStore} from "./home.store";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {provideComponentStore} from "@ngrx/component-store";
import {MatButton} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {AddProjectDialogComponent} from "../workspace/add-project-dialog/add-project-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddWorkspaceDialogComponent} from "./add-workspace-dialog/add-workspace-dialog.component";
import {MatIcon} from "@angular/material/icon";


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    AsyncPipe,
    MatProgressSpinner,
    MatButton,
    MatIcon
  ],
  styleUrls: ["home.component.css"],
  providers: [provideComponentStore(HomeStore)],
})
export class HomeComponent implements OnInit {
  readonly isLoading$ = this.homeStore.isLoading$;
  readonly isError$ = this.homeStore.isError$;
  readonly workspaceCarsStates$ = this.homeStore.workspaceCarsStates$;
  private dialogRef?: MatDialogRef<AddWorkspaceDialogComponent>

  constructor(
    private readonly homeStore: HomeStore,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.homeStore.navigateToWorkspaceEvent.subscribe({
      next: value => this.router.navigate([`/workspace/${value}`], {relativeTo: this.route}).then()
    })
    this.homeStore.loadHome()
  }

  createWorkspace(): void {
    this.dialogRef = this.dialog.open(AddWorkspaceDialogComponent, {
      height: '400px',
      width: '600px',
    });
    this.dialogRef.afterClosed().subscribe(result => result && this.homeStore.createWorkspace(result))
  }

  openWorkspace(id: number): void {
    this.homeStore.navigateToWorkspace(id)
  }

  deleteWorkspace(id: number): void {
    this.homeStore.deleteWorkspace(id);
  }
}

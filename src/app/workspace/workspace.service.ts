import { Injectable } from '@angular/core';
import {BehaviorSubject, first, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private _isSidebarActiveFlow: Subject<boolean> = new BehaviorSubject<boolean>(false);

  public get isSidebarActiveFlow(): Observable<boolean> {
    return this._isSidebarActiveFlow;
  }

  public switchActive() {
    this._isSidebarActiveFlow.pipe(first()).subscribe((isActive: boolean) => this._isSidebarActiveFlow.next(!isActive))
  }
}

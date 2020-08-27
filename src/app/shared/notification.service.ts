import {Injectable} from '@angular/core'
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) {
  }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'top'
  }

  success(msg: string) {
    this.config.panelClass = ['notification', 'success']
    this.snackBar.open(msg, '', this.config)
  }

  failure(msg: string) {
    this.config.panelClass = ['notification', 'failure']
    this.snackBar.open(msg, '', this.config)
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecoveryChange } from 'src/app/shared/models/recovery.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss', '../auth.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
  constructor(private route: ActivatedRoute, private userService: UserService, private _snackBar: MatSnackBar, private router: Router) { }
  ngOnInit(): void {

  }
  form = new FormGroup({
    password: new FormControl(null, [Validators.required]),
  });
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  recover() {
    this.route.queryParams.subscribe((params: Params) => {
      const code = params['code']
      const { password } = this.form.value
      const recovery = new RecoveryChange(code, password)
      this.userService.ChangePasswordRecovery(recovery).subscribe(
        (response: any) => {
          this.openSnackBar(response.message, 'OK')
          this.router.navigate(['/auth/login'])
        },
        (err) => {
          if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
          else this.openSnackBar('Произошла ошибка', 'ОК')
        }
      )
    })
  }
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}

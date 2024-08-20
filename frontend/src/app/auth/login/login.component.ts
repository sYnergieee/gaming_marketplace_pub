import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RecoveryPost } from 'src/app/shared/models/recovery.model';
import { SigninModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth.component.scss']
})
export class LoginComponent implements OnInit{
  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar, private userService: UserService) {}
  ngOnInit(): void {
    
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {horizontalPosition: 'center', verticalPosition: 'top', duration: 5000});
  }
  hide = true;
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
    ]),
  });
  getErrorMessage() {
    if (this.form.controls['email'].hasError('required')) {
      return 'Email не может быть пустым';
    }

    return this.form.controls['email'].hasError('email')
      ? 'Некорректный email'
      : '';
  }
  access_token: string='';
  refresh_token: string='';
  signin(){
    const {email, password}=this.form.value;
    const user=new SigninModel(email, password);
    this.authService.login(user).subscribe(
      (response:any) => {
        this.access_token=response['access_token']
        this.refresh_token=response['refresh_token']
        window.localStorage.setItem('access_token', this.access_token);
        window.localStorage.setItem('refresh_token', this.refresh_token);
        this.openSnackBar('Вы успешно вошли в аккаунт!', 'OK')
        this.router.navigate(['/system/profile'])
      },
      (err)=> {
        if (typeof err.error.detail!='string'){
          console.log(err.error.detail)
          this.openSnackBar('Такого пользователя не существует', 'OK')
        }
        else this.openSnackBar(err.error.detail, 'OK')
      }
    )
  }
  goToRecover(){
    if (this.form.controls.email.invalid){
      this.openSnackBar('Введите корректный адрес', 'OK')
    }
    else {
      const rec = this.form.controls.email.value
      const recovery = new RecoveryPost(rec)
      this.userService.CreateRecovery(recovery).subscribe(
        (response: any) => {
          this.openSnackBar('Ссылка для восстановления отправлена на почту', 'OK')
          // this.router.navigate(['/auth/recovery'], {
          //   queryParams: {
          //     code: response,
          //   },
          // });
        }
      )
    }

  }
}

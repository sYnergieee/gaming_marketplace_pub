import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { SelectInput } from 'src/app/shared/models/input.model';
import { RoleModel } from 'src/app/shared/models/role.model';
import { SignupModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

const KEY_SECRET_CODE = `${environment.KEY_SECRET_CODE}`;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss', '../auth.component.scss']
})
export class RegistrationComponent implements OnInit{
  constructor(
    private userService: UserService, private router: Router, private authService: AuthService, private _snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {horizontalPosition: 'center', verticalPosition: 'top', duration: 5000});
  }
  hide = true;
  form = new FormGroup({
    nickname: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    firstname: new FormControl(null, [Validators.required]),
    lastname: new FormControl(null, [Validators.required]),
    birthdate: new FormControl(null, [Validators.required]),
    role: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    telegram: new FormControl(null),
    discord: new FormControl(null),
    key: new FormControl(null)
  });
  ngOnInit(): void {
    this.userService.GetAllRoles().subscribe((roles) => {
      this.roles = roles as RoleModel[];
      this.roleInput.label = 'Роль';
      this.roleInput.icon = 'keyboard_arrow_down';
      this.roleInput.values = this.compile_values('role', this.roles)
    });
  }

  getErrorMessage() {
    if (this.form.controls['email'].hasError('required')) {
      return 'Email не может быть пустым';
    }

    return this.form.controls['email'].hasError('email')
      ? 'Некорректный email'
      : '';
  }
  roles: any[] = []
  roleInput: SelectInput = {
    field: 'role',
    type: 'text',
    label: 'Загрузка ролей...',
    formControl: this.form.get('role')
  }
  private _filterValues(value: any, items: any[]) {
    return items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  compile_values(name: string, arr: any[]) {
    return this.form.get(name)?.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? this._filterValues(value, arr) : arr.slice()))
    );
  }
  isAdmin(){
    const value = this.form?.get('role')
    if (value!=null){
      return true? value.value=='Администратор':false
    }
    return false
  }
  access_token: string='';
  refresh_token: string='';
  signup(){
    const {nickname, email, firstname, lastname, birthdate, role, password, telegram, discord, key} = this.form.value
    let flag = true
    if (key != null && role != null){
      if (key != KEY_SECRET_CODE && role == 'Администратор'){
        flag = false
      }
    }
    if (flag){
      const date = this.datePipe.transform(birthdate, 'yyyy-MM-dd')
      const user = new SignupModel(
        nickname, email, firstname, lastname, date, role, password, telegram, discord
      )
      this.authService.register(user).subscribe(
        (response:any) => {
          this.access_token=response['access_token']
          this.refresh_token=response['refresh_token']
          window.localStorage.setItem('access_token', this.access_token);
          window.localStorage.setItem('refresh_token', this.refresh_token);
          this.openSnackBar('Вы успешно зарегистрировали аккаунт!', 'OK')
          this.router.navigate(['/system/profile'])
        },
        (err)=> {
          if (typeof err.error.detail!='string'){
            this.openSnackBar('Неверные данные', 'OK')
          }
          else this.openSnackBar(err.error.detail, 'OK')
        }
      )
    }
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxCroppedEvent, NgxPhotoEditorService } from 'ngx-photo-editor';
import { UserEdit } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { UserService } from 'src/app/shared/services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(private photoEditorService: NgxPhotoEditorService,
    private userService: UserService, private imgService: ImageService,
    private authService: AuthService, private router: Router,
    private _snackBar: MatSnackBar, private datePipe: DatePipe, private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  form = new FormGroup({
    nickname: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    firstname: new FormControl(null, [Validators.required]),
    lastname: new FormControl(null, [Validators.required]),
    birthdate: new FormControl(null, [Validators.required]),
    password: new FormControl(null),
    telegram: new FormControl(null),
    discord: new FormControl(null),
  });
  output?: NgxCroppedEvent;
  usr: any
  img: any
  hide = true;
  getErrorMessage() {
    if (this.form.controls['email'].hasError('required')) {
      return 'Email не может быть пустым';
    }

    return this.form.controls['email'].hasError('email')
      ? 'Некорректный email'
      : '';
  }
  user_id: any = null
  other_user: any
  check_for_readonly = false
  ngOnInit(): void {
    this.userService.GetUser(null).subscribe(
      (user: any) => {
        this.usr = user
        this.route.queryParams.subscribe((params: Params) => {
          if (params['user_id']) {
            this.user_id = params['user_id']
            this.userService.GetUser(this.user_id).subscribe(
              (user: any) => {
                this.other_user = user
                this.check_for_readonly = true
                this.form.controls['nickname'].setValue(this.other_user.nickname)
                this.form.controls['email'].setValue(this.other_user.email)
                this.form.controls['firstname'].setValue(this.other_user.firstname)
                this.form.controls['lastname'].setValue(this.other_user.lastname)
                this.form.controls['birthdate'].setValue(this.other_user.birthdate)
                this.form.controls['telegram'].setValue(this.other_user.telegram)
                this.form.controls['discord'].setValue(this.other_user.discord)
                this.img = this.imgService.GetImage(this.other_user.img)
              },
              (err) => {
                console.log(err.error.detail);
                if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
                  this.authService.refreshToken();
                  this.ngOnInit()
                }
              }
            )
          }
          else {
            this.form.controls['nickname'].setValue(this.usr.nickname)
            this.form.controls['email'].setValue(this.usr.email)
            this.form.controls['firstname'].setValue(this.usr.firstname)
            this.form.controls['lastname'].setValue(this.usr.lastname)
            this.form.controls['birthdate'].setValue(this.usr.birthdate)
            this.form.controls['telegram'].setValue(this.usr.telegram)
            this.form.controls['discord'].setValue(this.usr.discord)
            this.img = this.imgService.GetImage(this.usr.img)
          }
        })
      },
      (err) => {
        console.log(err.error.detail);
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.ngOnInit()
        }
      }
    )

  }
  onOpenFileDialog(id: string) {
    document.getElementById(id)?.click();
  }
  displayImg() {
    if (this.output) return this.output.base64;
    else return this.img
  }
  fileImgChange(event: any) {
    this.output = undefined;
    this.photoEditorService
      .open(event, {
        modalMaxWidth: 'min(95%, 400px)',
        modalTitle: 'Фотография на вашей странице',
        applyBtnText: "Сохранить и продолжить",
        closeBtnText: "Вернуться назад",
        aspectRatio: 1 / 1,
        autoCropArea: 1,
      })
      .subscribe((data) => {
        this.output = data;
        if (this.output) {
          this.imgService.UploadImageUser(this.output.file);
        }
      },
        (err) => {
          console.log(err.error.detail);
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.ngOnInit()
            this.fileImgChange(event)
          }
        });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  saveChanges() {
    const { nickname, email, firstname, lastname, birthdate, password, telegram, discord } = this.form.value
    const date = this.datePipe.transform(birthdate, 'yyyy-MM-dd')
    const editUser = new UserEdit(
      nickname, email, firstname, lastname, date, password, telegram, discord
    )
    this.userService.EditUser(editUser).subscribe(
      (response: any) => {
        this.userService.GetUser(null).subscribe(
          (user: any) => {
            this.usr = user
            this.form.controls['nickname'].setValue(this.usr.nickname)
            this.form.controls['email'].setValue(this.usr.email)
            this.form.controls['firstname'].setValue(this.usr.firstname)
            this.form.controls['lastname'].setValue(this.usr.lastname)
            this.form.controls['birthdate'].setValue(this.usr.birthdate)
            this.form.controls['telegram'].setValue(this.usr.telegram)
            this.form.controls['discord'].setValue(this.usr.discord)
            this.img = this.imgService.GetImage(this.usr.img)
          },
        );
        this.openSnackBar(response.message, 'OK')
      },
      (err) => {
        if (typeof err.error.detail != 'string') {
          this.openSnackBar('Неверные данные', 'OK')
        }
        else this.openSnackBar(err.error.detail, 'OK')
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.saveChanges()
        }
      }
    )
  }
  deleteAccount() {
    let user_id = null
    if (this.other_user != null && this.usr.role_id == 3) {
      user_id = this.other_user.id
    }
    else {
      user_id = this.usr.id
    }
    this.userService.DeleteUser(user_id).subscribe(
      (response: any) => {
        this.authService.deleteTokens();
        this.openSnackBar(response.message, 'OK')
        this.router.navigate(['/auth/login'])
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.deleteAccount()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  goToSalesHist() {
    this.router.navigate(['/system/my-products'], {
      queryParams: {
        user_id: this.other_user.id,
        user_name: this.other_user.nickname
      },
    })
  }
  goToCustHist() {
    this.router.navigate(['/system/my-keys'], {
      queryParams: {
        user_id: this.other_user.id,
        user_name: this.other_user.nickname
      },
    })
  }
}

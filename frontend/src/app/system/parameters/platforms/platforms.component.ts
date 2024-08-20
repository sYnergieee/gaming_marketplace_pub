import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlatformPost, Platform } from 'src/app/shared/models/plaform.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { GameService } from 'src/app/shared/services/game.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-platforms',
  templateUrl: './platforms.component.html',
  styleUrls: ['./platforms.component.scss', '../parameters2.component.scss']
})
export class PlatformsComponent {
  constructor(private userService: UserService, private authService: AuthService, private constService: ConstService,
    private gameService: GameService, private _snackBar: MatSnackBar) { }
  usr: any;
  ngOnInit(): void {
    this.constService.GetPlatforms(null, null).subscribe(
      (response: any) => {
        this.search(null)
      }
    )
    this.userService.GetUser(null).subscribe(
      (user: any) => {
        this.usr = user
      },
      (err) => {
        console.log(err.error.detail);
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.ngOnInit()
        }
      }
    );
  }
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
  });
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  items: any[] = []
  search(name: string | null) {
    this.constService.GetPlatforms(name, null).subscribe(
      (response: any) => {
        this.items = response as Platform[]
      }
    );
  }
  addPlatform() {
    const { name } = this.form.value
    const platform = new PlatformPost(name)
    this.gameService.AddPlatform(platform).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        window.setTimeout(() => {
          this.search(null);
        }, 500);
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.addPlatform()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  editPlatform(id: number, name: string | null) {
    if (name == null || name == '') {
      this.openSnackBar('Неверно введено название платформы', 'OK')
    }
    else {
      const platform = new Platform(id, name)
      this.gameService.ChangePlatform(platform).subscribe(
        (response: any) => {
          this.openSnackBar(response.message, 'OK')
          window.setTimeout(() => {
            this.search(null);
          }, 500);
        },
        (err) => {
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.editPlatform(id, name)
          }
          else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
          else this.openSnackBar('Неверный формат данных', 'ОК')
        }
      )
    }
  }
  deletePlatform(id: number) {
    this.gameService.DeletePlatform(id).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        window.setTimeout(() => {
          this.search(null);
        }, 500);
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.deletePlatform(id)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }

}

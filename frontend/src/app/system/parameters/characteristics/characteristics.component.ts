import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Characteristic, CharacteristicPost } from 'src/app/shared/models/characteristic.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { GameService } from 'src/app/shared/services/game.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-characteristics',
  templateUrl: './characteristics.component.html',
  styleUrls: ['./characteristics.component.scss', '../parameters2.component.scss']
})
export class CharacteristicsComponent {
  constructor(private userService: UserService, private authService: AuthService, private constService: ConstService,
    private gameService: GameService, private _snackBar: MatSnackBar) { }
  usr: any;
  ngOnInit(): void {
    this.constService.GetCharacteristics(null).subscribe(
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
  items: any[] = []
  search(name: string | null) {
    this.constService.GetCharacteristics(name).subscribe(
      (response: any) => {
        this.items = response as Characteristic[]
      }
    );
  }
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    unit: new FormControl(null)
  });
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  addCharacteristic() {
    const { name, unit } = this.form.value
    const characteristic = new CharacteristicPost(name, unit)
    this.gameService.AddCharacteristic(characteristic).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        window.setTimeout(() => {
          this.search(null);
        }, 500);
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.addCharacteristic()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  editCharacteristic(id: number, name: string | null, unit: string | null) {
    if (name == null || name == '') {
      this.openSnackBar('Неверно введено название характеристики', 'OK')
    }
    if (unit == '') {
      unit = null
    }
    else {
      const platform = new Characteristic(id, name, unit)
      this.gameService.ChangeCharacteristic(platform).subscribe(
        (response: any) => {
          this.openSnackBar(response.message, 'OK')
          window.setTimeout(() => {
            this.search(null);
          }, 500);
        },
        (err) => {
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.editCharacteristic(id, name, unit)
          }
          else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
          else this.openSnackBar('Неверный формат данных', 'ОК')
        }
      )
    }
  }
  deleteCharacteristic(id: number) {
    this.gameService.DeleteCharacteristic(id).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        window.setTimeout(() => {
          this.search(null);
        }, 500);
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.deleteCharacteristic(id)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }

}

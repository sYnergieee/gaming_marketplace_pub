import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxCroppedEvent, NgxPhotoEditorService } from 'ngx-photo-editor';
import { map, startWith } from 'rxjs';
import { Characteristic, CharacteristicGame } from 'src/app/shared/models/characteristic.model';
import { GameChange } from 'src/app/shared/models/game.model';
import { SelectInput } from 'src/app/shared/models/input.model';
import { Publisher } from 'src/app/shared/models/publisher.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { GameService } from 'src/app/shared/services/game.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface DialogData {
  id: number
}

@Component({
  selector: 'app-dialog-change-game',
  templateUrl: './dialog-change-game.component.html',
  styleUrls: ['./dialog-change-game.component.scss']
})
export class DialogChangeGameComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogChangeGameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService, private constService: ConstService, private authService: AuthService, private datePipe: DatePipe,
    private gameService: GameService, private _snackBar: MatSnackBar, private imgService: ImageService, private photoEditorService: NgxPhotoEditorService
  ) { }
  output?: NgxCroppedEvent;
  usr: any;
  platforms: any;
  genres: any;
  img: any
  characteristics: any;
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    date: new FormControl(null, [Validators.required]),
    publisher: new FormControl(null, [Validators.required]),
  });
  formchar = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    value: new FormControl(null, [Validators.required])
  })
  ngOnInit(): void {
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
    this.constService.GetPublishers(null).subscribe((publishers) => {
      this.publishers = publishers as Publisher[];
      this.publInput.label = 'Издатель';
      this.publInput.icon = 'keyboard_arrow_down';
      this.publInput.values = this.compile_values('publisher', this.publishers)
    });
    this.constService.GetCharacteristics(null).subscribe((characteristics) => {
      this.characters = characteristics as Characteristic[];
      this.charInput.label = 'Характеристика';
      this.charInput.icon = 'keyboard_arrow_down';
      this.charInput.values = this.compile_values2('name', this.characters)
    });


    this.constService.GetGameShort(this.data.id).subscribe((game: any) => {
      this.form.controls['name'].setValue(game.name)
      this.form.controls['description'].setValue(game.description)
      this.form.controls['date'].setValue(game.release_date)
      this.form.controls['publisher'].setValue(game.publishers.name)
      this.constService.GetPlatforms(null, null).subscribe((platforms) => {
        this.platforms = platforms
        this.platforms.forEach((item: any) => {
          item.checked = game.platforms.some((i: any) => i.platform_id == item.id);
        });
      })
      this.constService.GetGenres(null).subscribe((genres) => {
        this.genres = genres
        this.genres.forEach((item: any) => {
          item.checked = game.genres.some((i: any) => i.genre_id == item.id);
        });
      })
      this.characteristics = game.characteristics
      this.img = this.imgService.GetImage(game.img)
    })
  }
  publishers: any[] = []
  publInput: SelectInput = {
    field: 'publisher',
    type: 'text',
    label: 'Загрузка издателей...',
    formControl: this.form.get('publisher')
  }
  characters: any[] = []
  charInput: SelectInput = {
    field: 'name',
    type: 'text',
    label: 'Загрузка характеристик...',
    formControl: this.formchar.get('name')
  }
  pr(items: any[]) {
    return items
      .filter((item: any) => {
        return item.checked;
      })
      .map((i: any) => {
        return i.id;
      });
  }
  private _filterValues(value: any, items: any[]) {
    return items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  compile_values(name: string, arr: any[]) {
    return this.form.get(name)?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (value ? this._filterValues(value, arr) : arr.slice()))
    );
  }
  compile_values2(name: string, arr: any[]) {
    return this.formchar.get(name)?.valueChanges.pipe(
      startWith(''),
      map((value: any) => (value ? this._filterValues(value, arr) : arr.slice()))
    );
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  change() {
    const { name, description, date, publisher } = this.form.value
    const publ = this.publishers.find(i => i.name == publisher)
    const platform_ids = this.pr(this.platforms)
    const genre_ids = this.pr(this.genres)
    const d = this.datePipe.transform(date, 'yyyy-MM-dd')
    const game = new GameChange(name, description, d, publ.id, platform_ids, genre_ids, this.data.id)
    this.gameService.ChangeGame(game).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.dialogRef.close();
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.change()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  delete() {
    this.gameService.DeleteGame(this.data.id).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.dialogRef.close();
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.delete()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  changeCharGame(game_id: number, characteristic_id: number, value: string) {
    const chargame = new CharacteristicGame(game_id, characteristic_id, value)
    this.gameService.PutCharGame(chargame).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.constService.GetGameShort(this.data.id).subscribe((game: any) => {
          this.characteristics = game.characteristics
        })
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.changeCharGame(game_id, characteristic_id, value)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  deleteCharGame(game_id: number, characteristic_id: number, value: string) {
    const chargame = new CharacteristicGame(game_id, characteristic_id, value)
    this.gameService.DeleteCharGame(chargame).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.constService.GetGameShort(this.data.id).subscribe((game: any) => {
          this.characteristics = game.characteristics
        })
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.deleteCharGame(game_id, characteristic_id, value)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  addChartoGame() {
    const { name, value } = this.formchar.value
    const char = this.characters.find((i: any) => i.name == name)
    const game = new CharacteristicGame(this.data.id, char.id, value)
    this.gameService.AddCharGame(game).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.constService.GetGameShort(this.data.id).subscribe((game: any) => {
          this.characteristics = game.characteristics
        })
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.addChartoGame()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
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
        modalTitle: 'Фотография игры',
        applyBtnText: "Сохранить и продолжить",
        closeBtnText: "Вернуться назад",
        aspectRatio: 1 / 1,
        autoCropArea: 1,
      })
      .subscribe((data) => {
        this.output = data;
        if (this.output) {
          this.imgService.UploadImageGame(this.output.file, this.data.id);
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
}

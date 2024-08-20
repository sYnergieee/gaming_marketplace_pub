import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenrePost, Genre } from 'src/app/shared/models/genre.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { GameService } from 'src/app/shared/services/game.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss', '../parameters2.component.scss']
})
export class GenresComponent {
  constructor(private userService: UserService, private authService: AuthService, private constService: ConstService,
    private gameService: GameService, private _snackBar: MatSnackBar) { }
  usr: any;
  ngOnInit(): void {
    this.constService.GetGenres(null).subscribe(
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
  addGenre() {
    const { name } = this.form.value
    const genre = new GenrePost(name)
    this.gameService.AddGenre(genre).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        window.setTimeout(() => {
          this.search(null);
        }, 500);
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.addGenre()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  editGenre(id: number, name: string | null) {
    if (name == null || name == '') {
      this.openSnackBar('Неверно введено название жанра', 'OK')
    }
    else {
      const genre = new Genre(id, name)
      this.gameService.ChangeGenre(genre).subscribe(
        (response: any) => {
          this.openSnackBar(response.message, 'OK')
          window.setTimeout(() => {
            this.search(null);
          }, 500);
        },
        (err) => {
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.editGenre(id, name)
          }
          else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
          else this.openSnackBar('Неверный формат данных', 'ОК')
        }
      )
    }
  }
  deleteGenre(id: number) {
    this.gameService.DeleteGenre(id).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        window.setTimeout(() => {
          this.search(null);
        }, 500);
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.deleteGenre(id)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  items: any[] = []
  search(name: string | null) {
    this.constService.GetGenres(name).subscribe(
      (response: any) => {
        this.items = response as Genre[]
      }
    );
  }
}

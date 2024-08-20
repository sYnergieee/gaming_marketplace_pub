import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith } from 'rxjs';
import { GamePost } from 'src/app/shared/models/game.model';
import { SelectInput } from 'src/app/shared/models/input.model';
import { Publisher } from 'src/app/shared/models/publisher.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { GameService } from 'src/app/shared/services/game.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { UserService } from 'src/app/shared/services/user.service';
import { DialogChangeGameComponent } from '../shared/dialog-change-game/dialog-change-game.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.scss']
})
export class GameCreateComponent implements OnInit {
  constructor(private userService: UserService, private router: Router, private constService: ConstService, private authService: AuthService, private datePipe: DatePipe,
    private gameService: GameService, private _snackBar: MatSnackBar, private imgService: ImageService, public dialog: MatDialog) { }
  usr: any;
  platforms: any;
  platforms_search: any;
  genres: any;
  genres_search: any;
  offset: number = 0
  ngOnInit(): void {
    this.offset = 0
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
      this.publishers_search = publishers as Publisher[];
      this.publInput.label = 'Издатель';
      this.publSearchInput.label = 'Издатель';
      this.publInput.icon = 'keyboard_arrow_down';
      this.publSearchInput.icon = 'keyboard_arrow_down';
      this.publInput.values = this.compile_values('publisher', this.publishers)
      this.publSearchInput.values = this.compile_values2('publisher', this.publishers)
    });
    this.constService.GetPlatforms(null, null).subscribe((platforms) => {
      this.platforms = platforms
      this.platforms_search = platforms
    })
    this.constService.GetGenres(null).subscribe((genres) => {
      this.genres = genres
      this.genres_search = genres
    })
    this.constService.GetGames(this.offset, null, null, null, null, null).subscribe((games) => {
      this.games = games
    })
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    date: new FormControl(null, [Validators.required]),
    publisher: new FormControl(null, [Validators.required]),
  });
  search_form = new FormGroup({
    name: new FormControl(null),
    publisher: new FormControl(null),
    date: new FormControl(null),
  })
  games: any
  publishers: any[] = []
  publishers_search: any[] = []
  publInput: SelectInput = {
    field: 'publisher',
    type: 'text',
    label: 'Загрузка издателей...',
    formControl: this.form.get('publisher')
  }
  publSearchInput: SelectInput = {
    field: 'publisher',
    type: 'text',
    label: 'Загрузка издателей...',
    formControl: this.search_form.get('publisher')
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
      map((value) => (value ? this._filterValues(value, arr) : arr.slice()))
    );
  }
  compile_values2(name: string, arr: any[]) {
    return this.search_form.get(name)?.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? this._filterValues(value, arr) : arr.slice()))
    );
  }
  addGame() {
    const { name, description, date, publisher } = this.form.value
    const publ = this.publishers.find(i => i.name == publisher)
    const platform_ids = this.pr(this.platforms)
    const genre_ids = this.pr(this.genres)
    const d = this.datePipe.transform(date, 'yyyy-MM-dd')
    const game = new GamePost(
      name, description, d, publ.id, platform_ids, genre_ids
    )
    this.gameService.AddGame(game).subscribe(
      (response: any) => {
        this.offset = 0
        this.constService.GetGames(this.offset, null, null, null, null, null).subscribe(
          (response: any) => {
            this.show_button = true
            this.games = response
          }
        )
        this.openSnackBar(response.message, 'OK')
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.addGame()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  applyFilter() {
    const { name, publisher, date } = this.search_form.value
    let publ = null
    if (publisher) {
      publ = this.publishers_search.find(i => i.name == publisher)
      if (publ) {
        publ = publ.id
      }
    }
    const platform_ids = this.pr(this.platforms_search)
    const genre_ids = this.pr(this.genres_search)
    const d = this.datePipe.transform(date, 'yyyy-MM-dd')
    this.offset = 0
    this.constService.GetGames(this.offset, name, publ, d, platform_ids, genre_ids).subscribe(
      (response: any) => {
        this.show_button = true
        this.games = response
      }
    )
  }
  getImageGame(game_img: any) {
    return this.imgService.GetImage(game_img)
  }
  changeGame(id: number) {
    const dialogRef = this.dialog.open(DialogChangeGameComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.offset = 0
      this.constService.GetGames(this.offset, null, null, null, null, null).subscribe((games) => {
        this.show_button = true
        this.games = games
      })
    });
  }
  openProducts(game_id: number) {
    let status_id = null
    if (this.usr.role_id != 3) {
      status_id = 6
    }
    this.router.navigate(['/system/products'], {
      queryParams: {
        game_id: game_id,
        status_id: status_id,
      },
    });
  }
  show_button = true
  moveOffset() {
    this.offset += 1
    const { name, publisher, date } = this.search_form.value
    let publ = null
    if (publisher) {
      publ = this.publishers_search.find(i => i.name == publisher)
      if (publ) {
        publ = publ.id
      }
    }
    const platform_ids = this.pr(this.platforms_search)
    const genre_ids = this.pr(this.genres_search)
    const d = this.datePipe.transform(date, 'yyyy-MM-dd')
    this.constService.GetGames(this.offset, name, publ, d, platform_ids, genre_ids).subscribe(
      (games: any) => {
        if (games.length == 0) {
          this.show_button = false
        }
        else {
          this.games.push(...games)
        }
      }
    )
  }
}

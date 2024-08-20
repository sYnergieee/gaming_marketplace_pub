import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationPost } from 'src/app/shared/models/application.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { GameService } from 'src/app/shared/services/game.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface PeriodicElement {
  name: string;
  position: number;
  nickname: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
];
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})


export class ApplicationsComponent implements OnInit {
  constructor(private userService: UserService, private authService: AuthService, private constService: ConstService,
    private gameService: GameService, private _snackBar: MatSnackBar) { }
  usr: any;
  ngOnInit(): void {
    this.userService.GetUser(null).subscribe(
      (user: any) => {
        this.usr = user
        let isCustomer = null
        if (this.usr.role_id == 1) {
          isCustomer = user.id
        }
        if (isCustomer) {
          this.displayedColumns = ['position', 'name']
        }
        this.constService.GetApplications(isCustomer).subscribe(
          (response: any) => {
            this.dataSource = new MatTableDataSource(
              response.map((resp: any) => {
                return {
                  position: resp.id,
                  name: resp.game_name,
                  nickname: resp.salesman.user.nickname
                }
              })
            )
          }
        )
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
    game_name: new FormControl(null, [Validators.required]),
  });
  displayedColumns: string[] = ['position', 'name', 'nickname', 'actions'];
  dataSource = new MatTableDataSource();
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  addGame() {
    const { game_name } = this.form.value
    const game = new ApplicationPost(game_name)
    this.gameService.AddAppl(game).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.ngOnInit()
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
  deleteAppl(id: number) {
    this.gameService.DeleteApplication(id).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.ngOnInit()
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.deleteAppl(id)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
}

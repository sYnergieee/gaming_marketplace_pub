import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Publisher, PublisherPost } from 'src/app/shared/models/publisher.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { GameService } from 'src/app/shared/services/game.service';
import { UserService } from 'src/app/shared/services/user.service';
@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss', '../parameters2.component.scss']
})
export class PublishersComponent {
  constructor(private userService: UserService, private authService: AuthService, private constService: ConstService,
    private gameService: GameService, private _snackBar: MatSnackBar) { }
  usr: any;
  ngOnInit(): void {
    this.constService.GetPublishers(null).subscribe(
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
  items: any[] = []
  search(name: string | null) {
    this.constService.GetPublishers(name).subscribe(
      (response: any) => {
        this.items = response as Publisher[]
      }
    );
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  addPublisher() {
    const { name } = this.form.value
    const publisher = new PublisherPost(name)
    this.gameService.AddPublisher(publisher).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        window.setTimeout(() => {
          this.search(null);
        }, 500);
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.addPublisher()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  editPublisher(id: number, name: string | null) {
    if (name == null || name == '') {
      this.openSnackBar('Неверно введено название издателя', 'OK')
    }
    else {
      const platform = new Publisher(id, name)
      this.gameService.ChangePublisher(platform).subscribe(
        (response: any) => {
          this.openSnackBar(response.message, 'OK')
          window.setTimeout(() => {
            this.search(null);
          }, 500);
        },
        (err) => {
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.editPublisher(id, name)
          }
          else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
          else this.openSnackBar('Неверный формат данных', 'ОК')
        }
      )
    }
  }
  deletePublisher(id: number) {
    this.gameService.DeletePublisher(id).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        window.setTimeout(() => {
          this.search(null);
        }, 500);
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.deletePublisher(id)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }

}

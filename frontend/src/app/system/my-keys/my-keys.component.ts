import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { UserService } from 'src/app/shared/services/user.service';
import { DialogReviewKeyComponent } from '../shared/dialog-review-key/dialog-review-key.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-my-keys',
  templateUrl: './my-keys.component.html',
  styleUrls: ['./my-keys.component.scss']
})
export class MyKeysComponent implements OnInit {
  constructor(private userService: UserService, private constService: ConstService, private authService: AuthService, private router: Router,
    private _snackBar: MatSnackBar, private imgService: ImageService, public dialog: MatDialog, private route: ActivatedRoute) { }
  usr: any;
  keys: any;
  other_user: any;
  other_user_name: any
  offset: number = 0
  ngOnInit(): void {
    this.offset = 0
    this.route.queryParams.subscribe((params: Params) => {
      if (params['user_name']) {
        this.other_user_name = params['user_name']
      }
      this.userService.GetUser(null).subscribe(
        (user: any) => {
          this.usr = user
          if (params['user_id']){
            this.other_user = params['user_id']
            this.constService.GetSelfCustomer(this.offset, params['user_id'], null).subscribe(
              (keys: any) => {
                this.keys = keys
              }
            )
          }
          else{
            this.constService.GetSelfCustomer(this.offset, null, null).subscribe(
              (keys: any) => {
                this.keys = keys
              }
            )
          }
        },
        (err) => {
          console.log(err.error.detail);
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.ngOnInit()
          }
        }
      );
    });
  }
  glob_name: any;
  search(name: string | null) {
    this.glob_name = name
    this.show_button = true
    this.offset = 0
    this.constService.GetSelfCustomer(this.offset, this.other_user, name).subscribe(
      (response: any) => {
        this.keys = response
      }
    );
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  getImageGame(game_img: any) {
    return this.imgService.GetImage(game_img)
  }
  addReview(product_id: number, key_id: number) {
    const dialogRef = this.dialog.open(DialogReviewKeyComponent, {
      data: { product_id: product_id, key_id: key_id },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.offset = 0
      this.show_button = true
      this.ngOnInit()
    });
  }
  goToUserPage(user_id: any) {
    this.router.navigate(['/system/profile'], {
      queryParams: {
        user_id: user_id,
      },
    })
  }
  show_button = true
  moveOffset() {
    this.offset += 1
    this.route.queryParams.subscribe((params: Params) => {
      if (params['user_id']){
        this.constService.GetSelfCustomer(this.offset, params['user_id'], this.glob_name).subscribe(
          (keys: any) => {
            if (keys.length == 0){
              this.show_button = false
            }
            else{
              this.keys.push(...keys)
            }
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
      else{
        this.constService.GetSelfCustomer(this.offset, null, this.glob_name).subscribe(
          (keys: any) => {
            if (keys.length == 0){
              this.show_button = false
            }
            else{
              this.keys.push(...keys)
            }
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
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { UserService } from 'src/app/shared/services/user.service';
import { DialogChangeProductComponent } from '../shared/dialog-change-product/dialog-change-product.component';
import { PostProduct } from 'src/app/shared/models/product.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { PostKey } from 'src/app/shared/models/key.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DialogProductReviewComponent } from '../shared/dialog-product-review/dialog-product-review.component';
import { PutCustProductAdmin } from 'src/app/shared/models/customer_product.model';
import { DialogCreateProductComponent } from '../shared/dialog-create-product/dialog-create-product.component';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  constructor(private userService: UserService,
    private constService: ConstService, private authService: AuthService, private _snackBar: MatSnackBar, private route: ActivatedRoute,
    public dialog: MatDialog, private imgService: ImageService, private prodService: ProductService, private router: Router) { }
  usr: any;
  games: any[] = []
  statuses: any[] = []
  other_user: any
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
          if (params['user_id']) {
            this.other_user = params['user_id']
            this.constService.GetSelfSalesman(this.offset, params['user_id'], null).subscribe(
              (gms: any) => {
                this.games = gms
              }
            )
          }
          else {
            this.constService.GetSelfSalesman(this.offset, null, null).subscribe(
              (gms: any) => {
                this.games = gms
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
    })

    this.constService.GetStatuses().subscribe(
      (stats: any) => {
        this.statuses = stats
      }
    )
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  search_form = new FormGroup({
    name: new FormControl(null),
  })
  game_name: any
  searchGame() {
    const { name } = this.search_form.value
    this.game_name = name
    this.offset = 0
    this.show_button = true
    this.constService.GetSelfSalesman(this.offset, this.other_user, name).subscribe(
      (gms: any) => {
        this.games = gms
      }
    )
  }
  getImageGame(game_img: any) {
    return this.imgService.GetImage(game_img)
  }
  prod_status(product_status_id: number) {
    return this.statuses.find((i: any) => i.id == product_status_id)
  }
  changeProduct(id: number) {
    const dialogRef = this.dialog.open(DialogChangeProductComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.show_button = true
      this.offset = 0
      this.ngOnInit()
    });
  }
  addProduct(game_id: any) {
    const dialogRef = this.dialog.open(DialogCreateProductComponent, {
      data: { id: game_id },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.show_button = true
      this.offset = 0
      this.ngOnInit()
    })
  }
  addKeyProduct(key_code: any, product_id: any) {
    if (key_code == '') {
      this.openSnackBar("Код не может быть пустым", 'OK')
    }
    else {
      let key = new PostKey(product_id, key_code)
      this.prodService.PostKeyProduct(key).subscribe(
        (response: any) => {
          this.openSnackBar(response.message, 'OK')
        },
        (err) => {
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.addKeyProduct(key_code, product_id)
          }
          else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
          else this.openSnackBar('Неверный формат данных', 'ОК')
        }
      )
    }
  }
  goToUserPage(user_id: any) {
    this.router.navigate(['/system/profile'], {
      queryParams: {
        user_id: user_id,
      },
    })
  }
  goToReviewPage(product_id: any) {
    const dialogRef = this.dialog.open(DialogProductReviewComponent, {
      width: '500px',
      data: { product_id: product_id, self_user_or_admin: true ? !this.other_user || this.usr.role_id == 3 : false },
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.offset = 0
      // this.constService.GetGames(this.offset, null, null, null, null, null).subscribe((games) => {
      //   this.show_button = true
      //   this.games = games
      // })
    });
  }
  show_button = true
  moveOffset() {
    this.offset += 1
    this.route.queryParams.subscribe((params: Params) => {
      if (params['user_id']) {
        this.other_user = params['user_id']
        this.constService.GetSelfSalesman(this.offset, params['user_id'], this.game_name).subscribe(
          (gms: any) => {
            if (gms.length == 0) {
              this.show_button = false
            }
            else {
              this.games.push(...gms)
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
      else {
        this.constService.GetSelfSalesman(this.offset, null, this.game_name).subscribe(
          (gms: any) => {
            if (gms.length == 0) {
              this.show_button = false
            }
            else {
              this.games.push(...gms)
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

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { UserService } from 'src/app/shared/services/user.service';
import { DialogChangeProductComponent } from '../shared/dialog-change-product/dialog-change-product.component';
import { DialogCreateProductComponent } from '../shared/dialog-create-product/dialog-create-product.component';
import { ProductService } from 'src/app/shared/services/product.service';
import { PostCustProduct, PutCustProductAdmin } from 'src/app/shared/models/customer_product.model';
import { PutProductAdmin } from 'src/app/shared/models/product.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectInput } from 'src/app/shared/models/input.model';
import { map, startWith } from 'rxjs';
import { DialogProductReviewComponent } from '../shared/dialog-product-review/dialog-product-review.component';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService,
    private constService: ConstService, private authService: AuthService, private _snackBar: MatSnackBar, private imgService: ImageService,
    public dialog: MatDialog, private prodService: ProductService) { }
  isChecked = true
  isBlocked = false
  usr: any;
  game: any;
  products: any;
  statuses: any;
  users: any;
  offset: number = 0;
  checkIfIsBlocked() {
    if (this.isBlocked)
      return 5
    else
      return 6
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
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
    this.constService.GetStatuses().subscribe(
      (response: any) => {
        this.statuses = response
      }
    )
    this.route.queryParams.subscribe((params: Params) => {
      this.constService.GetPlatforms(null, params['game_id']).subscribe((response) => {
        this.platforms = response as any[]
        this.platformInput.label = 'Платформа';
        this.platformInput.icon = 'keyboard_arrow_down';
        this.platformInput.values = this.compile_values2('platform', this.platforms)
      })
      this.constService.GetGameShort(params['game_id']).subscribe(
        (response: any) => {
          this.game = response
        }
      )
      this.constService.GetCurrGame(this.offset, params['game_id'], this.checkIfIsBlocked(), this.salesman, this.platform).subscribe(
        (response: any) => {
          this.products = response
        }
      )

    });
    this.userService.GetUsers(1, null).subscribe((users) => {
      this.salesmans = users as any[];
      this.userInput.label = 'Продавец';
      this.userInput.icon = 'keyboard_arrow_down';
      this.userInput.values = this.compile_values('salesman', this.salesmans)
    });
  }
  private _filterValues(value: any, items: any[]) {
    return items.filter((item) =>
      item.nickname.toLowerCase().includes(value.toLowerCase())
    );
  }
  private _filterValues2(value: any, items: any[]) {
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
    return this.form.get(name)?.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? this._filterValues2(value, arr) : arr.slice()))
    );
  }
  form = new FormGroup({
    salesman: new FormControl(null),
    platform: new FormControl(null),
  });
  salesmans: any[] = []
  platforms: any[] = [];
  userInput: SelectInput = {
    field: 'salesman',
    type: 'text',
    label: 'Загрузка продавцов...',
    formControl: this.form.get('salesman')
  }
  platformInput: SelectInput = {
    field: 'platform',
    type: 'text',
    label: 'Загрузка платформ...',
    formControl: this.form.get('platform')
  }
  getImageGame(game_img: any) {
    return this.imgService.GetImage(game_img)
  }
  buyKey(product_id: number) {
    const prod = new PostCustProduct(product_id)
    this.prodService.PostCustomerProduct(prod).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.route.queryParams.subscribe((params: Params) => {
          this.offset = 0
          this.show_button = true
          this.constService.GetCurrGame(this.offset, params['game_id'], this.checkIfIsBlocked(), this.salesman, this.platform).subscribe(
            (response: any) => {
              this.products = response
            }
          )
        });
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.buyKey(product_id)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  changeProduct(product_id: number) {
    const dialogRef = this.dialog.open(DialogChangeProductComponent, {
      data: { id: product_id },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.route.queryParams.subscribe((params: Params) => {
        this.offset = 0
        this.show_button = true
        this.constService.GetCurrGame(this.offset, params['game_id'], this.checkIfIsBlocked(), this.salesman, this.platform).subscribe(
          (response: any) => {
            this.products = response
          }
        )

      });
    });
  }
  review_status(customer_status_id: number) {
    return this.statuses.find((i: any) => i.id == customer_status_id)
  }
  blockProduct(name: any, price: any, game_id: any, description: any, id: any, product_status_id: any) {
    let psi = product_status_id
    if (product_status_id == 5) {
      psi = 6
    }
    else psi = 5
    const prod = new PutProductAdmin(name, price, game_id, description, id, psi)
    this.prodService.PutStatProduct(prod).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.route.queryParams.subscribe((params: Params) => {
          this.offset = 0
          this.show_button = true
          this.constService.GetCurrGame(this.offset, params['game_id'], this.checkIfIsBlocked(), this.salesman, this.platform).subscribe(
            (response: any) => {
              this.products = response
            }
          )
        });
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.blockProduct(name, price, game_id, description, id, psi)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  addProduct() {
    this.route.queryParams.subscribe((params: Params) => {
      const game_id = (params['game_id'])
      const dialogRef = this.dialog.open(DialogCreateProductComponent, {
        data: { id: game_id },
      });
      dialogRef.afterClosed().subscribe(result => {
        this.route.queryParams.subscribe((params: Params) => {
          this.offset = 0
          this.show_button = true
          this.constService.GetCurrGame(this.offset, params['game_id'], this.checkIfIsBlocked(), this.salesman, this.platform).subscribe(
            (response: any) => {
              this.products = response
            }
          )

        });
      });

    });
  }
  goToUserPage(user_id: any) {
    this.router.navigate(['/system/profile'], {
      queryParams: {
        user_id: user_id,
      },
    })
  }
  salesman: any = null
  platform: any = null
  applyFilter() {
    const { salesman, platform } = this.form.value
    let slsm: any = null
    let pltf: any = null
    if (salesman) {
      slsm = this.salesmans.find(i => i.nickname == salesman)
      if (slsm) {
        slsm = slsm.id
      }
    }
    this.salesman = slsm
    if (platform) {
      pltf = this.platforms.find(i => i.name == platform)
      if (pltf) {
        pltf = pltf.id
      }
    }
    this.platform = pltf
    this.route.queryParams.subscribe((params: Params) => {
      this.offset = 0
      this.show_button = true
      this.constService.GetCurrGame(this.offset, params['game_id'], this.checkIfIsBlocked(), slsm, pltf).subscribe(
        (response: any) => {
          this.products = response
        }
      )
    });
  }
  goToReviewPage(product_id: any, salesman_id: any) {
    const dialogRef = this.dialog.open(DialogProductReviewComponent, {
      width: '500px',
      data: { product_id: product_id, self_user_or_admin: true ? salesman_id == this.usr.id || this.usr.role_id == 3 : false },
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.offset = 0
      // this.constService.GetGames(this.offset, null, null, null, null, null).subscribe((games) => {
      //   this.show_button = true
      //   this.games = games
      // })
    });
  }
  matSlideClick() {
    this.route.queryParams.subscribe((params: Params) => {
      if (this.isBlocked) {
        this.isBlocked = false
      }
      else {
        this.isBlocked = true
      }
      this.offset = 0
      this.show_button = true
      this.constService.GetCurrGame(this.offset, params['game_id'], this.checkIfIsBlocked(), this.salesman, this.platform).subscribe(
        (response: any) => {
          this.products = response
        }
      )

    });
  }
  show_button = true
  moveOffset() {
    this.offset += 1
    this.route.queryParams.subscribe((params: Params) => {
      this.constService.GetCurrGame(this.offset, params['game_id'], this.checkIfIsBlocked(), this.salesman, this.platform).subscribe(
        (response: any) => {
          if (response.length == 0) {
            this.show_button = false
          }
          else {
            this.products.push(...response)
          }
        }
      )
    })
  }
}

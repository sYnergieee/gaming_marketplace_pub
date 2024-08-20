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
  selector: 'app-products-not-proc',
  templateUrl: './product-not-proc.component.html',
  styleUrls: ['./product-not-proc.component.scss']
})
export class ProductNotProcComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService,
    private constService: ConstService, private authService: AuthService, private _snackBar: MatSnackBar, private imgService: ImageService,
    public dialog: MatDialog, private prodService: ProductService) { }
  isChecked = true
  isBlocked = false
  usr: any;
  products: any;
  statuses: any;
  users: any;
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
    this.constService.GetProdNotProc(this.checkIfIsBlocked()).subscribe(
      (response: any) => {
        this.products = response
      }
    )
  }
  changeProduct(product_id: number) {
    const dialogRef = this.dialog.open(DialogChangeProductComponent, {
      data: { id: product_id },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.constService.GetProdNotProc(this.checkIfIsBlocked()).subscribe(
        (response: any) => {
          this.products = response
        }
      )
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
        this.constService.GetProdNotProc(this.checkIfIsBlocked()).subscribe(
          (response: any) => {
            this.products = response
          }
        )
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
  goToUserPage(user_id: any) {
    this.router.navigate(['/system/profile'], {
      queryParams: {
        user_id: user_id,
      },
    })
  }
  salesman: any = null
  goToReviewPage(product_id: any, salesman_id: any) {
    const dialogRef = this.dialog.open(DialogProductReviewComponent, {
      width: '500px',
      data: { product_id: product_id, self_user_or_admin: true ? salesman_id == this.usr.id || this.usr.role_id == 3 : false },
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.constService.GetProdNotProc(this.checkIfIsBlocked()).subscribe(
      //   (response: any) => {
      //     this.products = response
      //   }
      // )
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
      this.constService.GetProdNotProc(this.checkIfIsBlocked()).subscribe(
        (response: any) => {
          this.products = response
        }
      )

    });
  }
}

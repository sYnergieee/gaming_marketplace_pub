import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs';
import { PutCustProductAdmin } from 'src/app/shared/models/customer_product.model';
import { SelectInput } from 'src/app/shared/models/input.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface DialogData {
  product_id: number,
  self_user_or_admin: boolean
}

@Component({
  selector: 'app-dialog-product-review',
  templateUrl: './dialog-product-review.component.html',
  styleUrls: ['./dialog-product-review.component.scss']
})
export class DialogProductReviewComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogProductReviewComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService, private authService: AuthService, private _snackBar: MatSnackBar, private prodService: ProductService, private constService: ConstService,
    private router: Router
  ) { }
  usr: any;
  offset: number = 0;
  keys: any;
  ngOnInit(): void {
    this.offset = 0
    this.userService.GetUser(null).subscribe(
      (user: any) => {
        this.usr = user

        this.constService.GetCustStatForReviews().subscribe(
          (res: any) => {
            if (this.usr.role_id == 3) {
              this.customer_statuses = res
            }
            else {
              res.splice(2, 1)
              this.customer_statuses = res
            }
    
            this.statInput.label = 'Статус у покупателя';
            this.statInput.icon = 'keyboard_arrow_down';
            this.statInput.values = this.compile_values('customer_status', this.customer_statuses)
          }
        )

        this.getReviewsFromDB()
      },
      (err) => {
        console.log(err.error.detail);
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.ngOnInit()
        }
      }
    );
    this.constService.GetStatForReviews().subscribe(
      (res: any) => {
        this.uses = res
        this.usesInput.label = 'Статус ключа';
        this.usesInput.icon = 'keyboard_arrow_down';
        this.usesInput.values = this.compile_values('is_used', this.uses)
      }
    )
    this.userService.GetUsers(2, null).subscribe((users) => {
      this.customers = users as any[];
      this.custInput.label = 'Покупатель';
      this.custInput.icon = 'keyboard_arrow_down';
      this.custInput.values = this.compile_values2('customer', this.customers)
    });
  }

  getReviewsFromDB() {
    if (this.data.self_user_or_admin) {
      this.constService.GetReviews(this.data.product_id, this.offset, this.is_us, this.cust, this.cust_stat).subscribe(
        (revs: any) => {
          this.keys = revs
        },
        (err) => {
          console.log(err.error.detail);
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.getReviewsFromDB()
          }
        }
      )
    }
    else {
      this.constService.GetReviews(this.data.product_id, this.offset, true, this.cust, this.cust_stat).subscribe(
        (revs: any) => {
          this.keys = revs
        },
        (err) => {
          console.log(err.error.detail);
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.getReviewsFromDB()
          }
        }
      )
    }
  }

  customers: any[] = []
  customer_statuses: any[] = []
  uses: any[] = []
  form = new FormGroup({
    is_used: new FormControl(null),
    customer: new FormControl(null),
    customer_status: new FormControl(null),
  });
  statInput: SelectInput = {
    field: 'customer_status',
    type: 'text',
    label: 'Загрузка статусов...',
    formControl: this.form.get('customer_status')
  }
  usesInput: SelectInput = {
    field: 'is_used',
    type: 'text',
    label: 'Загрузка статусов...',
    formControl: this.form.get('is_used')
  }
  custInput: SelectInput = {
    field: 'customer',
    type: 'text',
    label: 'Загрузка покупателей...',
    formControl: this.form.get('customer')
  }
  private _filterValues(value: any, items: any[]) {
    return items.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
  }
  private _filterValues2(value: any, items: any[]) {
    return items.filter((item) =>
      item.nickname.toLowerCase().includes(value.toLowerCase())
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteKey(key_id: any) {
    this.prodService.DeleteKey(key_id).subscribe(
      (response: any) => {
        this.offset = 0
        this.show_button = true
        this.openSnackBar(response.message, 'OK')
        this.getReviewsFromDB()
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.deleteKey(key_id)
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
  changeStatCustProd(product_id: number, key_id: number, review: string, customer_status_id: number, customer_id: number) {
    const cust_prod = new PutCustProductAdmin(key_id, review, customer_status_id, customer_id)
    this.prodService.PutStatCustomerProduct(cust_prod).subscribe(
      (response: any) => {
        this.offset = 0
        this.show_button = true
        this.openSnackBar(response.message, 'OK')
        this.getReviewsFromDB()
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.changeStatCustProd(product_id, key_id, review, customer_status_id, customer_id)
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
    this.dialogRef.close();
  }
  cust: any;
  cust_stat: any;
  is_us: any;
  applyFilter() {
    this.offset = 0
    this.show_button = true
    const { is_used, customer, customer_status } = this.form.value
    if (customer) {
      this.cust = this.customers.find(i => i.nickname == customer)
      if (this.cust) {
        this.cust = this.cust.id
      }
    }
    if (customer_status) {
      this.cust_stat = this.customer_statuses.find(i => i.name == customer_status)
      if (this.cust_stat) {
        this.cust_stat = this.cust_stat.id
      }
    }
    if (is_used) {
      this.is_us = this.uses.find(i => i.name == is_used)
      if (this.is_us) {
        this.is_us = this.is_us.bool
      }
    }
    this.getReviewsFromDB()
  }
  show_button = true
  moveOffset() {
    this.offset += 1
    if (this.data.self_user_or_admin) {
      this.constService.GetReviews(this.data.product_id, this.offset, this.is_us, this.cust, this.cust_stat).subscribe(
        (revs: any) => {
          if (revs.length == 0){
            this.show_button = false
          }
          else{
            this.keys.push(...revs)
          }
        },
        (err) => {
          console.log(err.error.detail);
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.offset-=1
            this.moveOffset()
          }
        }
      )
    }
    else {
      this.constService.GetReviews(this.data.product_id, this.offset, true, this.cust, this.cust_stat).subscribe(
        (revs: any) => {
          if (revs.length == 0){
            this.show_button = false
          }
          else{
            this.keys.push(...revs)
          }
        },
        (err) => {
          console.log(err.error.detail);
          if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
            this.authService.refreshToken();
            this.offset-=1
            this.moveOffset()
          }
        }
      )
    }
  }
}

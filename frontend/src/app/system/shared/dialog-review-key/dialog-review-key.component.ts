import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, of, startWith } from 'rxjs';
import { PutCustProduct } from 'src/app/shared/models/customer_product.model';
import { SelectInput } from 'src/app/shared/models/input.model';
import { StatusModel } from 'src/app/shared/models/status.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface DialogData {
  product_id: number,
  key_id: number
}

@Component({
  selector: 'app-dialog-review-key',
  templateUrl: './dialog-review-key.component.html',
  styleUrls: ['./dialog-review-key.component.scss']
})
export class DialogReviewKeyComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogReviewKeyComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private prodService: ProductService,
    private userService: UserService, private authService: AuthService, private _snackBar: MatSnackBar, private constService: ConstService
  ) { }
  usr: any;
  statuses: any;
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
    this.constService.GetStatReview().subscribe(
      (stats: any) => {
        this.statuses = stats as StatusModel[];
        this.statInput.label = 'Статус';
        this.statInput.icon = 'keyboard_arrow_down';
        this.statInput.values = this.compile_values('status', this.statuses)
      }
    )
  }
  form = new FormGroup({
    status: new FormControl(null, [Validators.required]),
    review: new FormControl(null),
  });
  statInput: SelectInput = {
    field: 'status',
    type: 'text',
    label: 'Загрузка статусов...',
    formControl: this.form.get('status')
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
  pr(items: any[]) {
    return items
      .filter((item: any) => {
        return item.checked;
      })
      .map((i: any) => {
        return i.id;
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  sendReview() {
    const { status, review } = this.form.value
    const stat_id = this.statuses.find((i: any) => i.name == status)
    let cust_prod = new PutCustProduct(this.data.key_id, review, stat_id.id)
    this.prodService.PutCustomerProduct(cust_prod).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.dialogRef.close();
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.sendReview()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
}

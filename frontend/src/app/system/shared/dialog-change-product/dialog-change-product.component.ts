import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PutProduct } from 'src/app/shared/models/product.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface DialogData {
  id: number
}

@Component({
  selector: 'app-dialog-change-product',
  templateUrl: './dialog-change-product.component.html',
  styleUrls: ['./dialog-change-product.component.scss']
})

export class DialogChangeProductComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogChangeProductComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService, private constService: ConstService, private authService: AuthService, private _snackBar: MatSnackBar,
    private prodService: ProductService,
  ) { }
  usr: any;
  product: any;
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
    this.constService.GetCurrProduct(this.data.id).subscribe(
      (prod: any) => {
        this.product = prod
        this.form.controls['name'].setValue(prod.name)
        this.form.controls['price'].setValue(prod.price)
        this.form.controls['description'].setValue(prod.description)
      }
    )
  }
  form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
  });
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { horizontalPosition: 'center', verticalPosition: 'top', duration: 5000 });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  changeProduct() {
    const { name, price, description } = this.form.value
    let new_product = new PutProduct(name, price, this.product.game_id, description, this.data.id)
    this.prodService.PutProduct(new_product).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.dialogRef.close();
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.changeProduct()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
}

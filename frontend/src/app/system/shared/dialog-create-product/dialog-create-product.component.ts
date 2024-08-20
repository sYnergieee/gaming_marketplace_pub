import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectInput } from 'src/app/shared/models/input.model';
import { PostProduct } from 'src/app/shared/models/product.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface DialogData {
  id: number
}

@Component({
  selector: 'app-dialog-create-product',
  templateUrl: './dialog-create-product.component.html',
  styleUrls: ['./dialog-create-product.component.scss']
})
export class DialogCreateProductComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogCreateProductComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService, private authService: AuthService, private constService: ConstService, private _snackBar: MatSnackBar, private prodService: ProductService,
  ) { }
  usr: any;
  product: any;
  platforms: any;
  platform: any;
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
    this.constService.GetPlatforms(null, this.data.id).subscribe((response: any) => {
      this.platforms = response
      this.platform = response[0].id
    })
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
  addProduct() {
    const { name, price, description } = this.form.value
    let product = new PostProduct(name, price, this.data.id, description, this.platform)
    this.prodService.PostProduct(product).subscribe(
      (response: any) => {
        this.openSnackBar(response.message, 'OK')
        this.dialogRef.close();
      },
      (err) => {
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.addProduct()
        }
        else if (err.status == 400) this.openSnackBar(err.error.detail, 'OK')
        else this.openSnackBar('Неверный формат данных', 'ОК')
      }
    )
  }
}

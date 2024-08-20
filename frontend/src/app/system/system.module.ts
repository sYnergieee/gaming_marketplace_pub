import { CommonModule } from "@angular/common";
import { SystemRoutingModule } from "./system-routing.module";
import { NgModule } from "@angular/core";
import { SystemComponent } from "./system.component";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { NgxPhotoEditorModule } from "ngx-photo-editor";
import { ApplicationsComponent } from './applications/applications.component';
import { ParametersComponent } from './parameters/parameters.component';
import { PublishersComponent } from './parameters/publishers/publishers.component';
import { PlatformsComponent } from './parameters/platforms/platforms.component';
import { GenresComponent } from './parameters/genres/genres.component';
import { CharacteristicsComponent } from './parameters/characteristics/characteristics.component';
import { GameCreateComponent } from './game-create/game-create.component';
import { DialogChangeGameComponent } from './shared/dialog-change-game/dialog-change-game.component';
import { ProductsComponent } from './products/products.component';
import { MyKeysComponent } from './my-keys/my-keys.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { DialogChangeProductComponent } from './shared/dialog-change-product/dialog-change-product.component';
import { filterKey } from "../shared/pipes/filterKey.pipe";
import { filterProduct } from "../shared/pipes/filterProduct.pipe";
import { DialogCreateProductComponent } from './shared/dialog-create-product/dialog-create-product.component';
import { DialogReviewKeyComponent } from './shared/dialog-review-key/dialog-review-key.component';
import { DialogProductReviewComponent } from "./shared/dialog-product-review/dialog-product-review.component";
import { ProductNotProcComponent } from "./product-not-proc/product-not-proc.component";

@NgModule({
    declarations: [
      SystemComponent,
      FooterComponent,
      HeaderComponent,
      ProfileComponent,
      ApplicationsComponent,
      ParametersComponent,
      PublishersComponent,
      PlatformsComponent,
      GenresComponent,
      CharacteristicsComponent,
      GameCreateComponent,
      DialogChangeGameComponent,
      ProductsComponent,
      MyKeysComponent,
      MyProductsComponent,
      DialogChangeProductComponent,
      filterKey,
      filterProduct,
      DialogCreateProductComponent,
      DialogReviewKeyComponent,
      DialogProductReviewComponent,
      ProductNotProcComponent
    ],
    imports: [
      CommonModule,
      SystemRoutingModule,
      SharedModule,
      FormsModule,
      NgxPhotoEditorModule
    ],
  providers:[],
  })
  export class SystemModule { }
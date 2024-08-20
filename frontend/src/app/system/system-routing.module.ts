import { RouterModule, Routes } from "@angular/router";
import { SystemComponent } from "./system.component";
import { NgModule } from "@angular/core";
import { ProfileComponent } from "./profile/profile.component";
import { ApplicationsComponent } from "./applications/applications.component";
import { ParametersComponent } from "./parameters/parameters.component";
import { GameCreateComponent } from "./game-create/game-create.component";
import { ProductsComponent } from "./products/products.component";
import { MyProductsComponent } from "./my-products/my-products.component";
import { MyKeysComponent } from "./my-keys/my-keys.component";
import { AuthGuard } from "../shared/guards/auth.guard";
import { ProductNotProcComponent } from "./product-not-proc/product-not-proc.component";

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'parameters', component: ParametersComponent },
      { path: 'game-create', component: GameCreateComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'my-products', component: MyProductsComponent },
      { path: 'my-keys', component: MyKeysComponent },
      { path: 'prod-not-proc', component: ProductNotProcComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule { }

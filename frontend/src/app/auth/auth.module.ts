import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

@NgModule({
  declarations: [AuthComponent, LoginComponent, RegistrationComponent, RecoverPasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class AuthModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';
import { DatePipe } from '@angular/common';
import { NgxPhotoEditorModule } from 'ngx-photo-editor';
import { GameService } from './shared/services/game.service';
import { ImageService } from './shared/services/image.service';
import { ConstService } from './shared/services/const.service';
import { ProductService } from './shared/services/product.service';
import { AuthGuard } from './shared/guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    NgxPhotoEditorModule,
  ],
  providers: [AuthService, UserService, DatePipe, GameService, ImageService, ConstService, ProductService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

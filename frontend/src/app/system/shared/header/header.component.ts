import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LINKS, TABLE_ACCESS_ROUTE } from 'src/app/shared/consts';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private userService: UserService, private authService: AuthService, private imgService: ImageService, private router: Router) { }
  links = LINKS;
  ngOnInit() {
    this.userService.GetUser(null).subscribe(
      (user: any) => {
        this.usr = user
        this.img = this.imgService.GetImage(this.usr.img)
      },
      (err) => {
        console.log(err.error.detail);
        if (err.error.detail == 'Срок действия токена истек' || err.error.detail == 'Срок действия токена обновления истек') {
          this.authService.refreshToken();
          this.ngOnInit()
        }
      }
    );
  }
  usr: any
  img: any
  isAccess(path: string) {
    let roles = TABLE_ACCESS_ROUTE[path];
    if (this.usr?.role && roles) {
      return roles.includes(this.usr?.role.name);
    }
    return false;
  }
  goToProfile() {
    this.router.navigate(['/system/profile']);
  }
  logout() {
    this.authService.deleteTokens();
    this.router.navigate(['/auth/login'])
  }
  drawer(flag: boolean) {
    if (flag) {
      return { color: "#9400d3" };
    }
    return {};
  }
}

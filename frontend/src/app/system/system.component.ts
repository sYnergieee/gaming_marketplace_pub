import { Component, OnInit } from '@angular/core';
import { LINKS, TABLE_ACCESS_ROUTE } from '../shared/consts';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {
  mode: any = 'over';
  hasBackdrop: any = true;
  constructor(private userService: UserService, private authService: AuthService) { }
  links = LINKS;
  usr: any
  ngOnInit() {
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
  }

  isAccess(path: string) {
    let roles = TABLE_ACCESS_ROUTE[path];
    if (this.usr?.role && roles) {
      return roles.includes(this.usr?.role.name);
    }
    return false;
  }
  drawerColor(flag: boolean) {
    if (flag) {
      return { color: "#9400d3" };
    }
    return {};
  }
}

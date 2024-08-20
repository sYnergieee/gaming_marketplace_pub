import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent {
//ЛОГИКА ИНПУТОВ----------------------------------------------------------
mode: any = 'push';
color: any = '#673ab7';
hasBackdrop: any = false;
constructor(
  private route: ActivatedRoute,
  private router: Router,
) {}
genres: boolean = true;
publishers: boolean = false;
characteristics: boolean = false;
platforms: boolean = false;
ngOnInit() {
  this.route.queryParams.subscribe((params: Params) => {
    if (params['filter'] == 1) {
      this.genres = true;
      this.publishers = false;
      this.characteristics = false;
      this.platforms = false;
    } else if (params['filter'] == 2) {
      this.genres = false;
      this.publishers = true;
      this.characteristics = false;
      this.platforms = false;
    } else if (params['filter'] == 3) {
      this.genres = false;
      this.publishers = false;
      this.characteristics = true;
      this.platforms = false;
    } else if (params['filter'] == 4) {
      this.genres = false;
      this.publishers = false;
      this.characteristics = false;
      this.platforms = true;
    }
  });
}
clickFilter(filter: any = null) {
  this.router.navigate(['/system/parameters'], {
    queryParams: {
      filter: filter,
    },
  });
}
matchColor() {
  return this.color;
}
}

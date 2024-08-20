import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filterKey',
  })
  export class filterKey implements PipeTransform {
    transform(
      items: any[],
      is_used?: any,
    ): any {
    let res=items;
    if (is_used != null) {
        res = res.filter((i) => {
          return (
            i.is_used == is_used
          );
        });
      }
    return res;
  }
}
  
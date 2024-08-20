import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filterProduct',
  })
  export class filterProduct implements PipeTransform {
    transform(
      items: any[],
      product_status_id?: any,
    ): any {
    let res=items;
    if (product_status_id != null) {
        let psi: number
        if (product_status_id == true){
            psi = 5
        }
        else psi = 6
        res = res.filter((i) => {
            return (
                i.product_status_id == psi
            )
        })
    }
    return res;
  }
}
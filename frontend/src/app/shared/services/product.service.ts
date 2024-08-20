import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { PostProduct, PutProduct, PutProductAdmin } from '../models/product.model';
import { catchError } from 'rxjs';
import { handleError } from '../handle_error';
import { PostKey } from '../models/key.model';
import { PostCustProduct, PutCustProduct, PutCustProductAdmin } from '../models/customer_product.model';

const URL = `${environment.BACKEND_URL}/product`;

@Injectable()
export class ProductService{
    constructor(private http: HttpClient, private authService: AuthService) {}
    
    PostProduct(product: PostProduct){
        let token = this.authService.getAccessToken()
        return this.http.post(`${URL}/post_product`, product, {
            headers: { Authorization: `Bearer ${token}` },
            }).pipe(catchError(handleError))
    }

    PostKeyProduct(key: PostKey){
        let token = this.authService.getAccessToken()
        return this.http.post(`${URL}/post_key_product`, key, {
            headers: { Authorization: `Bearer ${token}` },
            }).pipe(catchError(handleError))
    }

    PostCustomerProduct(cust_prod: PostCustProduct){
        let token = this.authService.getAccessToken()
        return this.http.post(`${URL}/post_customer_product`, cust_prod, {
            headers: { Authorization: `Bearer ${token}` },
            }).pipe(catchError(handleError))
    }

    PutCustomerProduct(cust_prod: PutCustProduct){
        let token = this.authService.getAccessToken()
        return this.http.put(`${URL}/put_customer_product`, cust_prod, {
            headers: { Authorization: `Bearer ${token}` },
            }).pipe(catchError(handleError))
    }

    PutStatCustomerProduct(cust_prod: PutCustProductAdmin){
        let token = this.authService.getAccessToken()
        return this.http.put(`${URL}/put_stat_customer_product`, cust_prod, {
            headers: { Authorization: `Bearer ${token}` },
            }).pipe(catchError(handleError))
    }

    DeleteKey(key_id: number){
        let token = this.authService.getAccessToken()
        return this.http.delete(`${URL}/delete_key?key_id=${key_id}`, {
            headers: { Authorization: `Bearer ${token}` },
            }).pipe(catchError(handleError))
    }

    PutProduct(prod: PutProduct){
        let token = this.authService.getAccessToken()
        return this.http.put(`${URL}/put_product`, prod, {
            headers: { Authorization: `Bearer ${token}` },
            }).pipe(catchError(handleError))
    }

    PutStatProduct(prod: PutProductAdmin){
        let token = this.authService.getAccessToken()
        return this.http.put(`${URL}/put_stat_product`, prod, {
            headers: { Authorization: `Bearer ${token}` },
            }).pipe(catchError(handleError))
    }

}
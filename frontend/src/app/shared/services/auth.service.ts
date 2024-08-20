import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { handleError } from '../handle_error';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SigninModel, SignupModel } from '../models/user.model';

const URL = `${environment.BACKEND_URL}/user`;

@Injectable()
export class AuthService{

  constructor(private router:Router, private http: HttpClient){ }
  login(user:SigninModel):Observable<Object>{
    return this.http.post(URL+'/signin', user).pipe(catchError(handleError));
  }
  register(user:SignupModel):Observable<Object>{
    return this.http.post(URL+'/signup', user).pipe(catchError(handleError))
  }
  getAccessToken(){
    return window.localStorage.getItem('access_token')
  }
  deleteTokens(){
    window.localStorage.clear()
  }
  refreshToken(){
    let token = window.localStorage.getItem('refresh_token')
    return this.http.get(URL+'/refresh_token', {
      headers: {Authorization: `Bearer ${token}`},
    })
    .pipe(catchError(handleError))
    .subscribe(
      (response:any) => {
        window.localStorage.setItem('access_token', response['access_token']);
      },
      (err) => {
        this.router.navigate(['auth/login'])
        this.deleteTokens()
      }
    )
  }
  IsLoggedIn(){
    return window.localStorage.getItem('refresh_token') != null
  }
  }
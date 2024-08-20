import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs';
import { handleError } from '../handle_error';
import { UserEdit } from '../models/user.model';
import { RecoveryChange, RecoveryPost } from '../models/recovery.model';

const URL = `${environment.BACKEND_URL}/user`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  GetAllRoles() {
    return this.http.get(`${URL}/get_roles`);
  }
  GetUser(user_id: any) {
    let token = this.authService.getAccessToken()
    let url = `${URL}/get_user`
    if (user_id) {
      url += `?u_id=${user_id}`
    }
    return this.http.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(catchError(handleError))
  }
  GetUsers(role_id: any, nickname: any) {
    let url = URL + '/get_users'
    let f = false // если появился параметр то добавляем к url ? f=true иначе &
    if (role_id) {
      f = true
      url += `?role_id=${role_id}`
    }
    if (nickname) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      url += `nickname=${nickname}`
    }
    return this.http.get(url)
  }
  EditUser(user: UserEdit) {
    let token = this.authService.getAccessToken()
    return this.http.put(`${URL}/put`, user, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(catchError(handleError))
  }
  DeleteUser(user_id: number) {
    let token = this.authService.getAccessToken()
    return this.http.delete(`${URL}/delete?id=${user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(catchError(handleError))
  }
  CreateRecovery(rec: RecoveryPost) {
    return this.http.post(`${URL}/create_recovery?email=${rec.email}`, rec)
  }
  ChangePasswordRecovery(rec: RecoveryChange) {
    return this.http.put(`${URL}/change_password_recovery`, rec).pipe(catchError(handleError))
  }
}
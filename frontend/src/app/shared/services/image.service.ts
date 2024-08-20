import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs';
import { handleError } from '../handle_error';
const URL = `${environment.BACKEND_URL}/img`;

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  @Output() FileUnloaded = new EventEmitter();
  GetImage(name: string){
    return `${URL}/${name}`
  }
  upoadImgUser(formData: any){
    let token = this.authService.getAccessToken()
    return this.http.put(`${URL}/upl_user_image`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(catchError(handleError));
  }
  upoadImgGame(formData: any, game_id: number){
    let token = this.authService.getAccessToken()
    return this.http.put(`${URL}/upl_game_image?game_id=${game_id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(catchError(handleError));
  }
  UploadImageUser(fileImg: any){
    let formData = new FormData();
    formData.append('file', fileImg);
    console.log(formData);
    let s = this.upoadImgUser(formData).subscribe(
      (data) => {
        s.unsubscribe();
        this.FileUnloaded.emit(data);
      }
    )
  }
  UploadImageGame(fileImg: any, game_id: number){
    let formData = new FormData();
    formData.append('file', fileImg);
    console.log(formData);
    let s = this.upoadImgGame(formData, game_id).subscribe(
      (data) => {
        s.unsubscribe();
        this.FileUnloaded.emit(data);
      }
    )
  }
}
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { handleError } from '../handle_error';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ApplicationPost } from '../models/application.model';
import { Genre, GenrePost } from '../models/genre.model';
import { Publisher, PublisherPost } from '../models/publisher.model';
import { PlatformPost, Platform } from '../models/plaform.model';
import { Characteristic, CharacteristicGame, CharacteristicPost } from '../models/characteristic.model';
import { GameChange, GamePost } from '../models/game.model';

const URL = `${environment.BACKEND_URL}/game`;

@Injectable()
export class GameService{

  constructor(private router:Router, private http: HttpClient, private authService: AuthService){ }
    AddAppl(game: ApplicationPost){
        let token = this.authService.getAccessToken()
        return this.http.post(`${URL}/post_application?game_name=${game.game_name}`, game, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    DeleteApplication(id: number){
        let token = this.authService.getAccessToken()
        return this.http.delete(`${URL}/delete_application?application_id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            }).pipe(catchError(handleError))
    }
    AddGenre(genre: GenrePost){
      let token = this.authService.getAccessToken()
      return this.http.post(`${URL}/post_genre`, genre, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    ChangeGenre(genre: Genre){
      let token = this.authService.getAccessToken()
      return this.http.put(`${URL}/put_genre`, genre, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    DeleteGenre(genre_id: number){
      let token = this.authService.getAccessToken()
      return this.http.delete(`${URL}/delete_genre?genre_id=${genre_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    AddPublisher(publ: PublisherPost){
      let token = this.authService.getAccessToken()
      return this.http.post(`${URL}/post_publisher`, publ, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    ChangePublisher(publ: Publisher){
      let token = this.authService.getAccessToken()
      return this.http.put(`${URL}/put_publisher`, publ, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    DeletePublisher(publ_id: number){
      let token = this.authService.getAccessToken()
      return this.http.delete(`${URL}/delete_publisher?publisher_id=${publ_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    AddPlatform(platform: PlatformPost){
      let token = this.authService.getAccessToken()
      return this.http.post(`${URL}/post_platform`, platform, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    ChangePlatform(platform: Platform){
      let token = this.authService.getAccessToken()
      return this.http.put(`${URL}/put_platform`, platform, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    DeletePlatform(platform_id: number){
      let token = this.authService.getAccessToken()
      return this.http.delete(`${URL}/delete_platform?platform_id=${platform_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    AddCharacteristic(characteristic: CharacteristicPost){
      let token = this.authService.getAccessToken()
      return this.http.post(`${URL}/post_characteristic`, characteristic, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    ChangeCharacteristic(characteristic: Characteristic){
      let token = this.authService.getAccessToken()
      return this.http.put(`${URL}/put_characteristic`, characteristic, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    DeleteCharacteristic(characteristic_id: number){
      let token = this.authService.getAccessToken()
      return this.http.delete(`${URL}/delete_characteristic?characteristic_id=${characteristic_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    AddGame(game: GamePost){
      let token = this.authService.getAccessToken()
      return this.http.post(`${URL}/post_game`, game, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    ChangeGame(game: GameChange){
      let token = this.authService.getAccessToken()
      return this.http.put(`${URL}/put_game`, game, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    DeleteGame(game_id: number){
      let token = this.authService.getAccessToken()
      return this.http.delete(`${URL}/delete_game?game_id=${game_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    AddCharGame(chargame: CharacteristicGame){
      let token = this.authService.getAccessToken()
      return this.http.post(`${URL}/post_game_characteristic`, chargame, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    PutCharGame(chargame: CharacteristicGame){
      let token = this.authService.getAccessToken()
      return this.http.put(`${URL}/put_game_characteristic`, chargame, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
    }
    DeleteCharGame(chargame: CharacteristicGame){
      let token = this.authService.getAccessToken()
      return this.http.delete(`${URL}/delete_game_characteristic?game_id=${chargame.game_id}&characteristic_id=${chargame.characteristic_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        }).pipe(catchError(handleError))
      }
  }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { handleError } from '../handle_error';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

const URL = `${environment.BACKEND_URL}/const`;

@Injectable()
export class ConstService {

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }
  GetApplications(salesman_id: number | null) {
    if (salesman_id) {
      return this.http.get(URL + `/get_applications?salesman_id=${salesman_id}`)
    }
    return this.http.get(URL + '/get_applications')
  }
  GetGenres(name: string | null) {
    if (name) {
      return this.http.get(URL + `/get_genres?name=${name}`)
    }
    else return this.http.get(URL + `/get_genres`)
  }
  GetPublishers(name: string | null) {
    if (name) {
      return this.http.get(URL + `/get_publishers?name=${name}`)
    }
    else return this.http.get(URL + `/get_publishers`)
  }
  GetPlatforms(name: string | null, game_id: number | null) {
    let url = URL + '/get_platforms'
    let f = false // если появился параметр то добавляем к url ? f=true иначе &
    if (game_id) {
      f = true
      url += `?game_id=${game_id}`
    }
    if (name) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      url += `?name=${name}`
    }
    return this.http.get(url)
  }
  GetCharacteristics(name: string | null) {
    if (name) {
      return this.http.get(URL + `/get_characteristics?name=${name}`)
    }
    else return this.http.get(URL + `/get_characteristics`)
  }
  GetGameShort(game_id: number) {
    return this.http.get(`${URL}/get_curr_game_short?game_id=${game_id}`)
  }
  GetGames(offset: any, name: any, publisher_id: number | null, release_date: string | null,
    platforms_ids: number[] | null, genres_ids: number[] | null) {
    let f = false // если появился параметр то добавляем к url ? f=true иначе &
    let url = URL + '/get_games'
    if (offset) {
      f = true
      url += `?offset=${offset}`
    }
    if (name) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      url += `name=${name}`
    }
    if (publisher_id) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      url += `publisher_id=${publisher_id}`
    }
    if (release_date) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      url += `release_date=${release_date}`
    }
    if (platforms_ids) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      platforms_ids.forEach((i) => {
        url += `platform_ids=${i}&`;
      });
    }
    if (genres_ids) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      genres_ids.forEach((i) => {
        url += `genre_ids=${i}&`;
      });
    }
    return this.http.get(url)
  }
  GetCurrGame(offset: any, game_id: number, status_id: any, salesman_id: number | null, platform_id: number | null) {
    let url = `${URL}/get_curr_game?game_id=${game_id}`
    if (offset) {
      url += `&offset=${offset}`
    }
    if (status_id) {
      url += `&status_id=${status_id}`
    }
    if (salesman_id) {
      url += `&salesman_id=${salesman_id}`
    }
    if (platform_id) {
      url += `&platform_id=${platform_id}`
    }
    return this.http.get(url)
  }
  GetCurrProduct(product_id: number) {
    return this.http.get(`${URL}/get_curr_product?product_id=${product_id}`)
  }
  GetStatuses() {
    return this.http.get(`${URL}/get_statuses`)
  }
  GetSelfCustomer(offset: any, user_id: number | null, game_name: any) {
    let f = false // если появился параметр то добавляем к url ? f=true иначе &
    let token = this.authService.getAccessToken()
    let url = `${URL}/get_history_self_cust`
    if (user_id) {
      f = true
      url += `?u_id=${user_id}`
    }
    if (offset) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      url += `offset=${offset}`
    }
    if (game_name) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      url += `game_name=${game_name}`
    }
    return this.http.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(catchError(handleError))
  }
  GetSelfSalesman(offset: any, user_id: number | null, game_name: any) {
    let f = false // если появился параметр то добавляем к url ? f=true иначе &
    let token = this.authService.getAccessToken()
    let url = `${URL}/get_history_self_sales`
    if (user_id) {
      f = true
      url += `?u_id=${user_id}`
    }
    if (offset) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      url += `offset=${offset}`
    }
    if (game_name) {
      if (!f) {
        url += '?'
        f = true
      }
      else url += '&'
      url += `game_name=${game_name}`
    }
    return this.http.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(catchError(handleError))
  }
  GetStatReview(): Observable<any> {
    return of([
      { id: 2, name: 'Положительный отзыв' },
      { id: 3, name: 'Отрицательный отзыв' },
    ]);
  }
  GetStatForReviews(): Observable<any> {
    return of([
      { id: 1, name: 'Используется', bool: true },
      { id: 2, name: 'Не используется', bool: false },
    ]);
  }
  GetCustStatForReviews(): Observable<any> {
    return of([
      { id: 1, name: 'Нет' },
      { id: 2, name: 'Положительный' },
      { id: 3, name: 'Отрицательный необр.' },
      { id: 4, name: 'Отрицательный' },
    ]);
  }
  GetReviews(product_id: any, offset: any, is_used: any, customer_id: any, customer_status_id: any) {
    let f = false // если появился параметр то добавляем к url ? f=true иначе &
    let token = this.authService.getAccessToken()
    let url = `${URL}/get_reviews`
    url += `?product_id=${product_id}`
    if (offset) {
      url += `&offset=${offset}`
    }
    if (is_used != null) {
      url += `&is_used=${is_used}`
    }
    if (customer_id) {
      url += `&customer_id=${customer_id}`
    }
    if (customer_status_id) {
      url += `&customer_status_id=${customer_status_id}`
    }
    return this.http.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(catchError(handleError))
  }
  GetProdNotProc(is_blocked: number){
    let token = this.authService.getAccessToken()
    return this.http.get(`${URL}/get_prod_neg_not_proc?is_blocked=${is_blocked}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(catchError(handleError))
  }
}

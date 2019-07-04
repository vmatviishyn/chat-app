import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

const CHAT_TOKEN_KEY = 'chat_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) { }

  setToken(token) {
    this.cookieService.set(CHAT_TOKEN_KEY, token);
  }

  getToken() {
    return this.cookieService.get(CHAT_TOKEN_KEY);
  }

  deleteToken() {
    this.cookieService.delete(CHAT_TOKEN_KEY);
  }

  getPayload() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(window.atob(payload));
    }
    return payload.data;
  }
}

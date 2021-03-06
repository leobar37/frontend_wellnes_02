import { IUser } from './../@core/models/User';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private _jwt: JwtHelperService, private router: Router) {}

  getUserOfToken(): IUser {
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/login');
      return null;
    } else {
      return this._jwt.decodeToken<IUser>();
    }
  }
  isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    return this._jwt.isTokenExpired();
  }
  logout(): void {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
    this.router.navigateByUrl('/login');
  }
}

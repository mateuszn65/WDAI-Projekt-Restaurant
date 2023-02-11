import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve, reject) => {
        this.afAuth.onAuthStateChanged((user) => {
            if (user) {
                if (!user.emailVerified){
                  alert("Please verify your email")
                  this.router.navigate([route]);
                }
                resolve(true);
            } else {
                console.log('Auth Guard: user is not logged in');
                this.router.navigate(['']);
                resolve(false);
            }
        });
    });

  }
  
}

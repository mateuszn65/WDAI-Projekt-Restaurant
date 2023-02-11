import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  res: boolean = false;
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve, reject) => {
      this.auth.user$.subscribe((user) => {
        let roles = user?.roles;
        if (roles) {
          let allowedRoles = route.data['roles'] as Array<string>;
          if (roles.admin && allowedRoles.includes('admin')) resolve(true);
          else if (roles.manager && allowedRoles.includes('manager'))
            resolve(true);
          else if (roles.client && allowedRoles.includes('client'))
            resolve(true);
        } else resolve(false);
      });
    });
  }
}

import { Injectable, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument  } from '@angular/fire/compat/firestore';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_NAME = 'token_auth';
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  user$!: Observable<User| null | undefined>;
  userId!: string;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private userService: UserService, private card:CardService) {
    this._isLoggedIn$.next(this.isLogedIn());
    this.setUser()
  }
  setUser(){
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.userId = user.uid
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }
  isLogedIn(){
    return !!this.token;
  }
  get token(): any {
    return localStorage.getItem(this.TOKEN_NAME);
  }
  getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged( user => {
        if (user) {
          user.getIdToken().then(idToken => {
            this.userId = user.uid;
            this.card.setSum(this.userId)
            localStorage.removeItem(this.TOKEN_NAME)
            localStorage.setItem(this.TOKEN_NAME, idToken);
            resolve(idToken);    
          });
        }
      });
    })
  }


  login(email: string, password: string){
    let emailLower = email.toLowerCase();
    return this.afAuth.signInWithEmailAndPassword(emailLower, password).then(()=>{
      console.log("Auth Service: loginUser: success")
      this.setUser();
      this._isLoggedIn$.next(true);
      this.getToken();
      
    }).catch(error =>{
      console.log('Auth Service: login error...');
      console.log('error code', error.code);
      console.log('error', error);
      return { isValid: false, message: error.message };
    })
  }

  register(email: string, username:string, password: string): Promise<any>{
    let emailLower = email.toLowerCase();
    return this.afAuth.createUserWithEmailAndPassword(emailLower, password).then((result)=>{
      this.userService.createNewUser(result.user, username)
      this.card.createCard(result.user?.uid)
      // this.updateUserData(result.user, username)
      result.user?.sendEmailVerification();
    }).catch(error => {
      console.log('Auth Service: signup error', error);
      return { isValid: false, message: error.message };
    })
  }

  signOut(){
    this.afAuth.signOut().then(() =>{
      this.user$ = of(null);
      localStorage.removeItem(this.TOKEN_NAME)
      this._isLoggedIn$.next(false);
      this.router.navigate(['/login']);
    });
  }


}

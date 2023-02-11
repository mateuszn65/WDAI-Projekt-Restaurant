import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { Observable} from 'rxjs';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: AngularFirestore) { }

  getUsersList(): Observable<any>{
    return this.db.collection('users').valueChanges();
  }
  
  

  createNewUser(user: any, username: string){
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    const data: User = {
      uid:user.uid,
      email: user.email,
      username: username,
      banned: false,
      roles: {
        client: true,
        admin: false,
        manager: false
      }
    }
    return userRef.set(data, {merge: true})
  }
  updateUser(user: any){
    this.db.collection('users').doc(user.uid).update(user).then((e)=>{
      alert("User updated")
    }).catch(e=>{
      alert("somenthing went wrong")
    })
  }
}


import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { EmptyError, first, firstValueFrom, last, lastValueFrom, Observable, of, take, timeout } from 'rxjs';
import { Dish } from '../models/dish';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  sum:number = 0
  constructor(private db: AngularFirestore, private afs: AngularFirestore, private userService: UserService) { 
  }
  getCard(id: string | null): Observable<any>{
    if (id){
      return this.db.doc('cards/'+id).valueChanges();
    }
    return of(null)
  }

  createCard(id:any){
    const data = {
      card: []
    }
    this.db.collection('cards').doc(id).set(data)
  }

  updateCard(id:any, card:any){
    this.db.collection('cards').doc(id).update({'card': card})
  }

  updateAllCards(dish:any){
    
    let ids

    this.userService.getUsersList().forEach(async users=>{
      ids = users.map((user: { uid: any; })=>{return user.uid})
      if (ids){
        for (const id of ids) {
          let card = await firstValueFrom(this.getCard(id)).then((e: {card: Dish[]})=>{return e.card})
          card = card.filter((e)=>{return e.id != dish.id})
          this.updateCard(id, card)
        }
      }
    })

  }
  setSum(id: string | null){
    this.getCard(id).subscribe(e=>{
      if (e && e.card){
        this.sum = e.card.length
      }
    })
  }
  getSum(){
    return this.sum
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { Observable} from 'rxjs';
import { Dish } from '../models/dish';
import { Order } from '../models/order';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private db: AngularFirestore) { }
  getUserOrders() : Observable<any> {
    return this.db.collection('orders').valueChanges()
  }
  createNewOrder(userId: any, dishes: Dish[], noDishes: number[], price: number){
    
    const data: Order = {
      uid:userId,
      date: new Date,
      price: price,
      noDishes: noDishes,
      dishes: dishes
    }
     this.db.collection('orders').add(data)
  }
}

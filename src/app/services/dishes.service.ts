import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable} from 'rxjs';
import { Dish } from '../models/dish';
import { CardService } from './card.service';
import { RatingService } from './rating.service';
@Injectable({
  providedIn: 'root'
})
export class DishesService {
  constructor(private db: AngularFirestore, private cardService: CardService, private ratingService: RatingService) { }

  getDishesList(): Observable<any>{
    return this.db.collection('dishes').valueChanges();
  }

  updateTodayMaxOut(id: string, value: number) {
    this.db.collection('dishes').doc(id).update({'todayMaxOut': value})
  }
  createDish(dish: Dish): void {
    const newDish = this.db.collection('dishes').add(dish)
    newDish.then(e =>{
      this.updateDishId(e.id)
      this.ratingService.createNewRating(e.id)
    })
  }
  updateDishId(id: string) {
    this.db.collection('dishes').doc(id).update({'id': id})
  }
  updateDish(dish:any){
    this.db.collection('dishes').doc(dish.id).update(dish)
    this.cardService.updateAllCards(dish)
  }
  deleteDish(dish:any) {
    this.db.collection('dishes').doc(dish.id).delete()
    this.cardService.updateAllCards(dish)
  }
  getDish(id: string | null) : Observable<any> {
    return this.db.doc('dishes/'+id).valueChanges();
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { Observable} from 'rxjs';

import { Rating } from '../models/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private db: AngularFirestore) { }

  createNewRating(id: string){
    const data: Rating = {
      dishId: id,
      usersId: [],
      usersCanRateId: [],
      ratingSum: 0,
      ratingCount: 0
    }
    this.db.collection('rating').doc(id).set(data)
  }
  getDishRating(id: string | null) : Observable<any> {
    return this.db.doc('rating/'+id).valueChanges();
  }
  updateDishRating(rating: any){
    this.db.collection('rating').doc(rating.dishId).update(rating).then((e)=>{
      console.log("Rating updated")
    }).catch(e=>{
      console.log("somenthing went wrong when updating rating")
    })
  }
}

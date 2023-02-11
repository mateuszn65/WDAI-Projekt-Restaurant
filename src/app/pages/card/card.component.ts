import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Dish } from 'src/app/models/dish';
import { Rating } from 'src/app/models/rating';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { OrdersService } from 'src/app/services/orders.service';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  dishes: Dish[]
  inCard: Dish[]
  nodInCard: number[]
  user: any;
  available : number[];
  isSelectedPLN: boolean;
  dolarsRate:number = 0.25
  constructor(private cardService: CardService, private auth: AuthService, private orderService: OrdersService, private ratingService: RatingService) { 
      this.nodInCard = []
      this.inCard = []
      this.dishes = [];
      this.available = []
      this.isSelectedPLN = true
  }

  async ngOnInit(): Promise<void> {
    this.user = await firstValueFrom(this.auth.user$, {defaultValue: undefined})
    this.inCard = await firstValueFrom(this.cardService.getCard(this.user?.uid), {defaultValue: []}).then((e) =>{
      if (e) return e.card
    })
    this.inCard.sort((a, b) => {
      return a.id.localeCompare(b.id)
    })
    
    if (this.inCard.length > 0){
      this.nodInCard.push(1)
      this.dishes.push(this.inCard[0])
    }
    let k = 0
    for (let i = 1; i< this.inCard.length; i++){
      if (this.inCard[i].id == this.inCard[i-1].id){
        this.nodInCard[k] ++
      }else{
        this.nodInCard.push(1)
        this.dishes.push(this.inCard[i])
        k++
      }
    }
    for (const dish of this.dishes) {
      this.available.push(dish.todayMaxOut - this.inCard.filter(e=>{
        return e.id == dish.id
      }).length)
    }
  }


  total(){
    if (this.inCard.length > 0){
      return this.inCard.map(e=> {return e.price}).reduce((prev, curr)=>{
      return prev + curr
    })
    }
    return 0
  }
  async order(){
    if (this.dishes.length > 0){
      this.orderService.createNewOrder(this.auth.userId, this.dishes, this.nodInCard, this.total())
      for (const dish of this.dishes) {
        let rating: Rating = {
          dishId: '',
          usersId: [],
          ratingSum: 0,
          ratingCount: 0,
          usersCanRateId: []
        }
        rating = await firstValueFrom(this.ratingService.getDishRating(dish.id))
        rating?.usersCanRateId?.push(this.auth.userId)
        this.ratingService.updateDishRating(rating)
      }
      this.cardService.updateCard(this.auth.userId, [])
      this.dishes = []
      alert("Thank you. We recived your order")
    }
    
  }
  add(value:number, i:number){
    if (this.available[i] - value > this.dishes[i].todayMaxOut){
      return
    }
    this.cardService.sum += value
    this.available[i] -=  value
    if (value > 0){
      this.inCard.push(this.dishes[i])
      this.nodInCard[i]++
      this.cardService.updateCard(this.auth.userId, this.inCard)
      
    }else {
      let removed = false
      this.inCard = this.inCard.filter(v =>{
        if (removed) return true
        if (v.id == this.dishes[i].id){
          removed = true
          return false
        }
        return true
      })
      this.nodInCard[i]--
      this.cardService.updateCard(this.auth.userId, this.inCard)
    }
  }



  //buttons
  buttonClasses(i:number){
    if(this.available[i] <= 0){
      return 'hide'
    }else if (this.available[i] <= 2){
      return 'btn-small btn-floating red'
    }else if (this.available[i] <= 5){
      return 'btn-small btn-floating orange'
    }
    return 'btn-small btn-floating green'
  }
  
  buttonPLNClasses(){
    if(this.isSelectedPLN){
      return 'btn-small cyan darken-4'
    }
    return 'btn-small'
  }
  buttonDolarClasses(){
    if(!this.isSelectedPLN){
      return 'btn-small cyan darken-4'
    }
    return 'btn-small'
  }

  dolarCurency(){
    if(this.isSelectedPLN){
      this.isSelectedPLN = false
    }
  }
  plnCurency(){
    if(!this.isSelectedPLN){
      this.isSelectedPLN = true
    }
  }
}


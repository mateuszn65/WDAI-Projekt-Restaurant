import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { Dish } from 'src/app/models/dish';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { DishesService } from 'src/app/services/dishes.service';
@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit{
  inCard : Dish[];
  dishes : Dish[];
  available : number[];
  user: any;
  dolarsRate:number = 0.25


  constructor(private dishesService: DishesService, private cardService: CardService, private auth: AuthService, private router: Router) { 
      this.inCard = []
      this.dishes = [];
      this.available = []
  }

  async ngOnInit(): Promise<void> {
    this.user = await firstValueFrom(this.auth.user$, {defaultValue: undefined})
    this.inCard = await firstValueFrom(this.cardService.getCard(this.user?.uid), {defaultValue: []}).then((e) =>{
      if (e) return e.card
    })

    this.dishesService.getDishesList().subscribe(e =>{
      this.dishes = e
      for (const dish of this.dishes) {
          if (this.inCard){
            this.available.push(dish.todayMaxOut - this.inCard.filter(e=>{
              return e.id == dish.id
            }).length)
          }else{
            this.available.push(dish.todayMaxOut)
          }
        }
    })
    
        

  }


  add(value:number, i:number){
    if (this.available[i] - value > this.dishes[i].todayMaxOut){
      return
    }
    this.cardService.sum += value
    this.available[i] -=  value
    if (value > 0){
      this.inCard.push(this.dishes[i])
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
      this.cardService.updateCard(this.auth.userId, this.inCard)
    }
  }
  isLogedIn(){
    return this.auth.isLogedIn()
  }
  details(i:number){
    if (this.isLogedIn())
      this.router.navigate(['/menu', this.dishes[i].id])
  }

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
  
}

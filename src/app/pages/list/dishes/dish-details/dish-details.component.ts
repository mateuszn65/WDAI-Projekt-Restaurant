import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { Dish } from 'src/app/models/dish';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { DishesService } from 'src/app/services/dishes.service';

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit{
  dishDetails!: Observable<Dish>
  dish!: Dish
  available: number = 0
  isSelectedPLN: boolean = true
  dolarsRate:number = 0.25
  inCard: Dish[] = []
  user: any;
  constructor(private dishesService: DishesService, 
    private route: ActivatedRoute, 
    private cardService: CardService,
    private auth: AuthService,
    private location: Location) { }

  async ngOnInit(): Promise<void> {
    this.user = await firstValueFrom(this.auth.user$, {defaultValue: undefined})
    this.inCard = await firstValueFrom(this.cardService.getCard(this.user?.uid), {defaultValue: []}).then((e) =>{
      if (e) return e.card
    })
    

    this.dishDetails = this.route.paramMap.pipe(
      switchMap((params:ParamMap) => this.dishesService.getDish(params.get('id')))
    )
    this.dishDetails.subscribe(
      dish => {
        this.dish = dish
        this.available = dish.todayMaxOut - this.inCard.filter(e=>{
          return e.id == dish.id
        }).length
      }
    )
  }

  

  goBack(){
    this.location.back();
  }

  
  add(value:number){
    if (this.available - value > this.dish.todayMaxOut){
      return
    }
    this.cardService.sum += value
    this.available -=  value
    if (value > 0){
      this.inCard.push(this.dish)
      this.cardService.updateCard(this.auth.userId, this.inCard)
      
    }else {
      let removed = false
      this.inCard = this.inCard.filter(v =>{
        if (removed) return true
        if (v.id == this.dish.id){
          removed = true
          return false
        }
        return true
      })
      this.cardService.updateCard(this.auth.userId, this.inCard)
    }
  }


  //buttons
  buttonClasses(){
    if(this.available <= 0){
      return 'hide'
    }else if (this.available <= 2){
      return 'btn-small btn-floating red'
    }else if (this.available <= 5){
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

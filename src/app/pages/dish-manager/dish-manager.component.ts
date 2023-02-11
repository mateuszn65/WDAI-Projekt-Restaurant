import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Dish } from 'src/app/models/dish';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { DishesService } from 'src/app/services/dishes.service';

@Component({
  selector: 'app-dish-manager',
  templateUrl: './dish-manager.component.html',
  styleUrls: ['./dish-manager.component.css']
})
export class DishManagerComponent implements OnInit {
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
          this.available.push(dish.todayMaxOut - this.inCard.filter(e=>{
            return e.id == dish.id
          }).length)
        }
    })

  }
  addDish(){
    this.router.navigate(['/add-dish'])
  }

  editDish(i:number){
    this.router.navigate(['/edit-dish', this.dishes[i].id])
  }

  removeDish(i:number){
    this.dishesService.deleteDish(this.dishes[i])
    this.dishes = [];
    this.available = []
  }

}

import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Dish } from 'src/app/models/dish';
import { DishesService } from 'src/app/services/dishes.service';
@Component({
  selector: 'app-edit-dish',
  templateUrl: './edit-dish.component.html',
  styleUrls: ['./edit-dish.component.css']
})
export class EditDishComponent implements OnInit{
  dishDetails!: Observable<Dish>
  model: Partial<Dish> = {};
  categories: string[] = ["śniadanie", "obiad", "kolacja", "inne"];
  types: string[] = ["mięsne", "vegetariańskie", "vegańskie", "inne"];
  kitchens: string[] = ["polska", "włoska", "francuska", "mieszana"];
  ingredients: string[] = []
  urls: string[] = []
  constructor(private dishService: DishesService, private route: ActivatedRoute, private dishesService: DishesService) {}

  ngOnInit(): void {
    this.dishDetails = this.route.paramMap.pipe(
      switchMap((params:ParamMap) => this.dishesService.getDish(params.get('id')))
    )
    this.dishDetails.subscribe(
      dish => {
        this.model = dish
        this.ingredients = dish.ingredients
        this.urls = dish.url
      }
    )
  }
  
  send() {
    this.model.ingredients = this.ingredients
    this.model.url = this.urls
    this.dishService.updateDish(this.model as Dish)
    alert("dodano nową pozycje do menu")
    
  }
  addIngredient(){
    this.ingredients.push("")
  }
  removeIngredient(i: number){
    let removed = false
      this.ingredients = this.ingredients.filter((v, j) =>{
        if (removed) return true
        if (j == i){
          removed = true
          return false
        }
        return true
      })
  }
  removeAllIngredients(){
    this.ingredients = []
  }
  addUrl(){
    this.urls.push("")
  }
  removeUrl(i: number){
    let removed = false
      this.urls = this.urls.filter((v, j) =>{
        if (removed) return true
        if (j == i){
          removed = true
          return false
        }
        return true
      })
  }
  removeAllUrls(){
    this.urls = []
  }
  trackByFn(index: any, item: any) {
    return index;
 }
 
}

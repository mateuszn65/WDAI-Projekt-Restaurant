import { Component, OnInit } from '@angular/core';
import { Dish } from 'src/app/models/dish';
import { DishesService } from 'src/app/services/dishes.service';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css']
})
export class AddDishComponent implements OnInit {

  model: Partial<Dish> = {};
  categories: string[] = ["śniadanie", "obiad", "kolacja", "inne"];
  types: string[] = ["mięsne", "vegetariańskie", "vegańskie", "inne"];
  kitchens: string[] = ["polska", "włoska", "francuska", "mieszana"];
  ingredients: string[] = []
  urls: string[] = []
  constructor(private dishService: DishesService) {}

  ngOnInit(): void {
    
  }
  
  send() {
    console.log(this.model)
    this.model.ingredients = this.ingredients
    this.model.url = this.urls
    this.dishService.createDish(this.model as Dish)
    this.model = {}
    this.removeAllIngredients()
    this.removeAllUrls()
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

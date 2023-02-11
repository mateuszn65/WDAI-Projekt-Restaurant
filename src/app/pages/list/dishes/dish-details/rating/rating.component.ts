import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Rating } from 'src/app/models/rating';
import { AuthService } from 'src/app/services/auth.service';
import { RatingService } from 'src/app/services/rating.service';



@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() dishId: string | undefined;
  rating: Rating = {
    dishId: '',
    usersId: [],
    ratingSum: 0,
    ratingCount: 0,
    usersCanRateId: []
  }
  currentRate = 0
  stars = [5, 4, 3, 2, 1]
  isHovering = false
  constructor(private ratingService: RatingService, private auth: AuthService) { 
  }

  ngOnInit(): void {
    if (this.dishId){
      this.ratingService.getDishRating(this.dishId).subscribe(e=>{
        this.rating = e
        if (e && e.rating){
          this.currentRate = e.rating
        }
      })
    }

  }

  private async canRate(){
    if (this.rating.usersId.includes(this.auth.userId) || !this.rating.usersCanRateId.includes(this.auth.userId)) return false
    let notAllowedRoles = ['admin', 'manager']
    return await firstValueFrom(this.auth.user$, {defaultValue: undefined}).then(user=>{
      if (user && user.roles){
      if (user.roles.admin && notAllowedRoles.includes('admin')) return false
      if (user.roles.manager && notAllowedRoles.includes('manager')) return false
      if (user.roles.client && notAllowedRoles.includes('client')) return false
      if (user.banned) return false
      if (user.roles.client) return true
      return false;
    }
    return false;
    }).catch((e)=>{return false})
    
    
  }



  rate(i:number){
    this.canRate().then(e=>{
      if (e){
      this.rating.ratingCount ++
      this.rating.ratingSum += i
      this.rating?.usersId?.push(this.auth.userId)
      this.rating.rating = this.rating.ratingSum / this.rating.ratingCount
      this.ratingService.updateDishRating(this.rating)
      console.log("rating updated")
    }
    })
    
    
    
  }
  curr(i:number){
    if (this.currentRate && i <= this.currentRate && !this.isHovering)
      return "curr"
    return ""
  }
  hover(){
    this.isHovering = true
  }
  leave(){
    this.isHovering = false
  }
}

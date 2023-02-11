import { Component, OnInit} from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  user: any;
  userId: any;
  constructor(public cardService: CardService, private auth: AuthService) {
   }

  async ngOnInit(): Promise<void> { 
    this.auth.user$.subscribe(user=>{
      this.user = user
    })
    this.userId = await firstValueFrom(this.auth.user$).then(e=>{
      return e?.uid
    })
    this.cardService.setSum(this.user?.uid)
  }
  sum(){
    return this.cardService.getSum()
  }
  signOut(){
    this.auth.signOut()
  }

  private canAccess(allowedRoles: string[]){
    if (this.user && this.user.roles) {
      if (this.user.roles.admin && allowedRoles.includes('admin')) return true
      if (this.user.roles.manager && allowedRoles.includes('manager')) return true
      if (this.user.roles.client && allowedRoles.includes('client')) return true
    }
    return false;
  }

  adminView(){
    let allowedRoles = ['admin']
    return this.canAccess(allowedRoles)
    
  }

  dishesManager(){
    let allowedRoles = ['admin', 'manager']
    return this.canAccess(allowedRoles)
  }
  isLogedIn(){
    return this.auth.isLogedIn()
  }
}

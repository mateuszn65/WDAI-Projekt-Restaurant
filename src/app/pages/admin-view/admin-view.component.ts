import { Component, OnInit } from '@angular/core';
import { Roles, User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
  email!:string;
  user!: User | undefined;
  notFountMessage = '';
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }
  findUser(){
    if (this.email){
      this.userService.getUsersList().subscribe(
        users => {
          for (const u of users) {
            if (u.email == this.email){
              this.user = u;
              this.notFountMessage = ''
              return
            }
          }
        }
        );
    }
    this.notFountMessage = "User not found"
    this.user = undefined;
  }
  update(){
    this.userService.updateUser(this.user)
  }

}

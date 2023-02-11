import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email!: string;
  username!: string;
  password!: string;
  firebaseErrorMessage: string="";
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  register(){


    this.auth.register(this.email, this.username, this.password).then((result) =>{
      if (result == null){
        alert("Confirm your email")
        this.router.navigate(['/login']);
      }else if (result.isValid == false){
        this.firebaseErrorMessage = result.message;
      }
    }).catch(() => {

    })
  }
}

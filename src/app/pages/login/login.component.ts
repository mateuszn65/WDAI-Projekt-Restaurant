import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  firebaseErrorMessage: string="";
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  login(){
    

    this.auth.login(this.email, this.password).then((result) =>{
      if (result == null){
        console.log('logging in...');
        this.router.navigate(['']);
      }else if (result.isValid == false) {
        console.log('login error', result);
        this.firebaseErrorMessage = result.message;
      }
    })
    
  }
}

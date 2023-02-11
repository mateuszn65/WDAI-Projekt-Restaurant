import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ListComponent } from './pages/list/list.component';
import { DishesComponent } from './pages/list/dishes/dishes.component';
import { ButtonComponent } from './button/button.component';
import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpClientModule } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
import { HomeComponent } from './pages/home/home.component';
import { AddDishComponent } from './pages/dish-manager/add-dish/add-dish.component';
import { CardComponent } from './pages/card/card.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { DishDetailsComponent } from './pages/list/dishes/dish-details/dish-details.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthService } from './services/auth.service';
import { AdminViewComponent } from './pages/admin-view/admin-view.component';
import { DishManagerComponent } from './pages/dish-manager/dish-manager.component';
import { EditDishComponent } from './pages/dish-manager/edit-dish/edit-dish.component';
import { RatingComponent } from './pages/list/dishes/dish-details/rating/rating.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListComponent,
    DishesComponent,
    ButtonComponent,
    HomeComponent,
    AddDishComponent,
    CardComponent,
    PageNotFoundComponent,
    DishDetailsComponent,
    LoginComponent,
    RegisterComponent,
    AdminViewComponent,
    DishManagerComponent,
    EditDishComponent,
    RatingComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig ),
    AngularFirestoreModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

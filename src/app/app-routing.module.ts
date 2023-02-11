import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './pages/list/list.component';
import { CardComponent } from './pages/card/card.component';
import { AddDishComponent } from './pages/dish-manager/add-dish/add-dish.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { DishDetailsComponent } from './pages/list/dishes/dish-details/dish-details.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { DishManagerComponent } from './pages/dish-manager/dish-manager.component';
import { AdminViewComponent } from './pages/admin-view/admin-view.component';
import { EditDishComponent } from './pages/dish-manager/edit-dish/edit-dish.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'menu', component: ListComponent},
  {path: 'card', component: CardComponent, canActivate: [AuthGuard]},
  {path: 'dish-manager', component: DishManagerComponent, canActivate: [AuthGuard, RoleGuard], 
    data:{roles: ['admin', 'manager']}
  },
  {path: 'add-dish', component: AddDishComponent, canActivate: [AuthGuard, RoleGuard], 
    data:{roles: ['admin', 'manager']}
  },
  { path: 'menu/:id', component: DishDetailsComponent, canActivate: [AuthGuard, RoleGuard], 
    data:{ roles: ['client', 'admin', 'manager']},
  },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard, RoleGuard], 
    data:{ roles: ['client', 'admin', 'manager']},
  },
  {path: 'admin-view', component: AdminViewComponent, canActivate: [AuthGuard, RoleGuard], 
    data:{roles: ['admin']}
  },
  { path: 'edit-dish/:id', component: EditDishComponent, canActivate: [AuthGuard, RoleGuard], 
    data:{ roles: ['admin', 'manager']},
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

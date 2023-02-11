import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders!: Order[]
  constructor(private auth: AuthService, private router: Router, private orderService: OrdersService) { }

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe(e=>{
      if (e){
        this.orders = e
        this.orders = this.orders.filter(o =>{
          return this.auth.userId == o.uid
        })
      }
      
    })
  }

}

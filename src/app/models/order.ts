import { Dish } from "./dish";

export interface Order {
    uid: string;
    date: Date;
    price: number
    noDishes: number[]
    dishes: Dish[]
  }
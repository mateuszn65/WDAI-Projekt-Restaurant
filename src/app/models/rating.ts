export interface Rating {
    dishId: string;
    usersId: string[]
    usersCanRateId: string[]
    rating?: number
    ratingSum: number
    ratingCount: number
  }
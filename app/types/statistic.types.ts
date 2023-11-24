import { IOrderResponse } from "./order.type";

export interface IStatisticOverview {
  slug: string;
  number: number;
  link?: string;
}

export interface IStatistic {
  overview?: IStatisticOverview[];
  transactions?: IOrderResponse[];
}

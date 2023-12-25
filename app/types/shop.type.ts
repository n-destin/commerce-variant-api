import mongoose from "mongoose";
import {IPolicy} from './policy.type'
import {IInventoryItem} from './inventory.type'

export interface IShop {
  name: string;
  headquartersLocation: string;
  marketLocations: string[];
  deliveryOptions: IDeliveryOption[];
  policies: IPolicy;
  inventory: IInventoryItem[];
}
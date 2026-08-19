import { BaseEntity } from "@/types/base.entity";
import { BuildingType } from "./BuildingType";

export interface Building extends BaseEntity {
  name: string;
  type: BuildingType;
  description?: string;
  latitude: number;
  longitude: number;
}

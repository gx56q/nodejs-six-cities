import { City } from '../../shared/types/city.enum.js';
import { HousingType } from '../../shared/types/housing-type.enum.js';
import { ComfortType } from '../../shared/types/comfort-type.enum.js';
import { LocationDto } from './location.dto.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public isPremium!: boolean;
  public rating!: number;
  public housingType!: HousingType;
  public rooms!: number;
  public maxGuests!: number;
  public price!: number;
  public comforts!: ComfortType[];
  public location!: LocationDto;
}

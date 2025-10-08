import { UserType } from '../../shared/types/user-type.enum.js';

export class UpdateUserDto {
  public name?: string;
  public email?: string;
  public avatar?: string;
  public password?: string;
  public type?: UserType;
}

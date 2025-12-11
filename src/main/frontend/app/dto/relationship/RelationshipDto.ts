import { UserDto } from 'components/dto/UserDto.ts';
import {RelationshipStatusDto} from 'components/dto/relationship/RelationshipStatusDto.ts';


export interface RelationshipDto {
  id: number,
  partner: UserDto,
  status: RelationshipStatusDto
}

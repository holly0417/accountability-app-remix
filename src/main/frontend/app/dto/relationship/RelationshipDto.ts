import type {UserDto} from '../user/UserDto';
import type {RelationshipStatusDto} from './RelationshipStatusDto';


export interface RelationshipDto {
  id: number,
  partner: UserDto,
  status: RelationshipStatusDto
}

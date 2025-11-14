import { MaxLength } from 'class-validator';
import { TransferLeadershipDto } from './transfer-leadership-guild.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateGuildDto extends OmitType(TransferLeadershipDto, [
  'newLeaderId',
]) {
  @MaxLength(30, {
    message: 'Description must not be more than 30 characters long',
  })
  description: string;
}

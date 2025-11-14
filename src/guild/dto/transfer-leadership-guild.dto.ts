import { IsNotEmpty } from 'class-validator';

export class TransferLeadershipDto {
  @IsNotEmpty()
  leaderId: string;

  @IsNotEmpty()
  newLeaderId: string;

  @IsNotEmpty()
  guildId: string;
}

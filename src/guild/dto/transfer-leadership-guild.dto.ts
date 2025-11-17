import { IsNotEmpty } from 'class-validator';

export class TransferLeadershipDto {
  @IsNotEmpty()
  newLeaderId: string;

  @IsNotEmpty()
  guildId: string;
}

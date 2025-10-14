import { Test, TestingModule } from '@nestjs/testing';
import { CanvasController } from './canvas.controller';
import { CanvasService } from './canvas.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('CanvasController', () => {
  let controller: CanvasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [CanvasController],
      providers: [CanvasService],
    }).compile();

    controller = module.get<CanvasController>(CanvasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

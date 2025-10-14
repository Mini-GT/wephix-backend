import { Test, TestingModule } from '@nestjs/testing';
import { CanvasService } from './canvas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CanvasService', () => {
  let service: CanvasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanvasService, PrismaService],
    }).compile();

    service = module.get<CanvasService>(CanvasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

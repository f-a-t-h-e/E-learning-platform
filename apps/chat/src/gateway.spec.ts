import { Test, TestingModule } from '@nestjs/testing';
import { Gateway } from './gateway';

describe('Gateway', () => {
  let gateway: Gateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Gateway],
    }).compile();

    gateway = module.get<Gateway>(Gateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SupportRequestClientController } from './support-request-client.controller';

describe('SupportRequestClientController', () => {
  let controller: SupportRequestClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportRequestClientController],
    }).compile();

    controller = module.get<SupportRequestClientController>(SupportRequestClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

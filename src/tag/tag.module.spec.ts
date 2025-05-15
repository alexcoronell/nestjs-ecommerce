import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TagModule } from './tag.module';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './entities/tag.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: TagService;
  let controller: TagController;
  let repository: Repository<Tag>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TagModule],
    })
      .overrideProvider(getRepositoryToken(Tag))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<TagService>(TagService);
    controller = module.get<TagController>(TagController);
    repository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have TagService and TagController', () => {
    expect(module.get(TagService)).toBeInstanceOf(TagService);
    expect(module.get(TagController)).toBeInstanceOf(TagController);
  });

  it('should inject TypeORM repository for Tag', () => {
    expect(module.get(getRepositoryToken(Tag))).toBeDefined();
  });
});

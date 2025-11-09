/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { TagController } from './tag.controller';

/* Services */
import { TagService } from './tag.service';

/* Entities */
import { Tag } from './entities/tag.entity';

/* Interfaces */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* DTO's */
import { CreateTagDto } from './dto/create-tag.dto';

/* Faker */
import { createTag, generateTag, generateManyTags } from '@faker/tag.faker';

describe('TagController', () => {
  let controller: TagController;
  let service: TagService;

  const mockTag: Tag = generateTag();
  const mockTags: Tag[] = generateManyTags(10);
  const mockNewTag: CreateTagDto = createTag();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockTags.length),
    count: jest.fn().mockResolvedValue(mockTags.length),
    findAll: jest.fn().mockResolvedValue(mockTags),
    findOne: jest.fn().mockResolvedValue(mockTag),
    findOneByName: jest.fn().mockResolvedValue(mockTag),
    create: jest.fn().mockResolvedValue(mockNewTag),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count tags controllers', () => {
    it('should call countAll tag service', async () => {
      expect(await controller.countAll()).toBe(mockTags.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count tag service', async () => {
      expect(await controller.count()).toBe(mockTags.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find tags controllers', () => {
    it('should call findAll tag service', async () => {
      expect(await controller.findAll()).toBe(mockTags);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOne tag service', async () => {
      expect(await controller.findOne(1)).toBe(mockTag);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return an tag by name', async () => {
      expect(await controller.findOneByname(mockTag.name));
      expect(service.findOneByName).toHaveBeenCalledTimes(1);
    });
  });

  describe('create tags controller', () => {
    it('should call create tag service', async () => {
      const request = { user: 1 };
      await controller.create(mockNewTag, request as AuthRequest);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update tags controller', () => {
    it('should call update tags service', async () => {
      const request = { user: 1 };
      const changes = { name: 'newName' };
      await controller.update(1, request as AuthRequest, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove tags controller', () => {
    it('shoudl call remove tags service', async () => {
      const request = { user: 1 };
      await controller.remove(1, request as AuthRequest);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});

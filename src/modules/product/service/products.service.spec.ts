import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from '../repositories/products.repository';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAllByRestaurant: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('deve criar um produto', async () => {
    const productDto = { name: 'Hamburguer', price: 25.99, description: 'Delicioso', imageUrl: 'http://example.com/img.png' };
    const restaurantId = 'rest123';

    jest.spyOn(repository, 'create').mockResolvedValue({
        id: 'prod1',
        name: 'Hamburguer',
        price: new Prisma.Decimal(25.99), 
        description: 'Delicioso',
        imageUrl: 'http://example.com/img.png',
        restaurantId: 'rest123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const result = await service.create(restaurantId, productDto);

    expect(result).toEqual({ id: 'prod1', ...productDto, restaurantId });
    expect(repository.create).toHaveBeenCalledWith(restaurantId, productDto);
  });

  it('deve retornar um produto pelo ID', async () => {
    const product = { 
      id: 'prod1', 
      name: 'Pizza', 
      price: new Prisma.Decimal(39.99), 
      description: 'Delicious', 
      imageUrl: 'http://example.com/pizza.png', 
      restaurantId: 'rest123', 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    jest.spyOn(repository, 'findById').mockResolvedValue(product);

    const result = await service.findById('prod1');

    expect(result).toEqual(product);
  });

  it('deve lançar erro se o produto não for encontrado', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(service.findById('invalid_id')).rejects.toThrow(NotFoundException);
  });

  it('deve listar todos os produtos de um restaurante', async () => {
    const products = [
      { id: 'p1', name: 'Pizza', price: new Prisma.Decimal(39.99), description: 'Delicious', imageUrl: 'http://example.com/pizza.png', restaurantId: 'rest123', createdAt: new Date(), updatedAt: new Date() },
      { id: 'p2', name: 'Burger', price: new Prisma.Decimal(25.99), description: 'Tasty', imageUrl: 'http://example.com/burger.png', restaurantId: 'rest123', createdAt: new Date(), updatedAt: new Date() },
    ];
    jest.spyOn(repository, 'findAllByRestaurant').mockResolvedValue(products);

    const result = await service.findAllByRestaurant('rest123');

    expect(result).toEqual(products);
  });

  it('deve atualizar um produto existente', async () => {
    const updatedProduct = { 
      id: 'p1', 
      name: 'Super Pizza', 
      price: new Prisma.Decimal(49.99), 
      description: 'Updated Description', 
      imageUrl: 'http://example.com/superpizza.png', 
      restaurantId: 'rest123', 
      createdAt: new Date('2022-01-01T00:00:00Z'), 
      updatedAt: new Date() 
    };
    jest.spyOn(repository, 'update').mockResolvedValue(updatedProduct);

    const result = await service.update('p1', { name: 'Super Pizza', price: 49.99 });

    expect(result).toEqual(updatedProduct);
  });

  it('deve lançar erro ao tentar atualizar um produto inexistente', async () => {
    jest.spyOn(repository, 'update').mockResolvedValue(null);

    await expect(service.update('invalid_id', { name: 'Pizza Nova' })).rejects.toThrow(NotFoundException);
  });

  it('deve deletar um produto', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await expect(service.delete('p1')).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('p1');
  });
});

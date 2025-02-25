import {Test, TestingModule} from '@nestjs/testing'
import { RestaurantService } from './restaurant.service'
import { RestaurantRepository } from '../repositories/restaurant.respository'

describe('RestaurantService', ()=>{
    let service: RestaurantService
    let repository: RestaurantRepository

    beforeEach(async ()=> {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
              RestaurantService,
              {
                provide: RestaurantRepository,
                useValue: {
                  create: jest.fn(),
                  findByOwner: jest.fn(),
                },
              },
            ],
          }).compile();
      
          service = module.get<RestaurantService>(RestaurantService);
          repository = module.get<RestaurantRepository>(RestaurantRepository); 
    })

    it('Deve criar um restaurante', async ()=> {
        const mockRestaurant = {
            id: 'uuid-mockado',
            name: 'Chama Burger',
            restaurantPhone: '51 999999999',
            address: 'rua do hamburguer, 71',
            ownerId: 'user-id-mockado',
            description: 'O melhor hambúrguer da cidade',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        
        jest.spyOn(repository, 'create').mockResolvedValue(mockRestaurant)

        const result = await service.create('user-id-mockado', {name: 'Chama Burger'})
        expect(result).toEqual(mockRestaurant)
        expect(repository.create).toHaveBeenCalledWith('user-id-mockado', {name: 'Chama Burger'})
    })
})
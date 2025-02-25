import {Test, TestingModule} from '@nestjs/testing'
import * as bcrypt from 'bcryptjs'
import { UsersRepository } from '../repositories/users.repository'
import { UserService } from './users.service'
import { NotFoundException } from '@nestjs/common'

describe('UserService', ()=>{
    let service: UserService
    let repository: UsersRepository

    beforeEach(async ()=> {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
              UserService,
              {
                provide: UsersRepository,
                useValue: {
                  create: jest.fn(),
                  findByEmail: jest.fn(),
                  updated: jest.fn(),
                  delete: jest.fn(),
                },
              },
            ],
          }).compile();
      
          service = module.get<UserService>(UserService);
          repository = module.get<UsersRepository>(UsersRepository); 
    })

    it('Deve criar um usuário com senha criptografada', async ()=> {
       const userDto = {
        id: 'id-mockado',
        name: 'Endrio',
        email: 'endrio@endrio.com',
        phone: '51999999999',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
       const hashedPassword = await bcrypt.hash(userDto.password, 8)

       jest.spyOn(repository, 'create').mockResolvedValue({...userDto, password: hashedPassword }) 

       const result = await service.create(userDto) 

       expect(result.password).not.toBe(userDto.password)
       expect(repository.create).toHaveBeenCalledWith({ ...userDto, password: expect.any(String)})
    })

    it('deve encontrar um usuário pelo e-mail', async () => {
      const user = { 
        id: '1', 
        name: 'Endrio',
        email: 'endrio@email.com',
        phone: '51999999999',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      jest.spyOn(repository, 'findByEmail').mockResolvedValue(user)
  
      const result = await service.findByEmail('endrio@email.com')
  
      expect(result).toEqual(user)
    })

    it('deve atualizar um usuário existente', async () => {
      const existingUser = {
        id: '1',
        name: 'Endrio',
        email: 'endrio@email.com',
        phone: '51999999999',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date('2025-01-01T00:00:00Z'),
        
    };
      
    const updatedUser = { 
      ...existingUser, 
      name: 'John Doe', 
      updatedAt: new Date(),  
    };

      jest.spyOn(repository, 'updated').mockResolvedValue(updatedUser)
      const result = await service.updated('1', { name: 'John Doe' });

      expect(result.name).toBe('John Doe');
      expect(result.updatedAt).not.toEqual(existingUser.updatedAt); 
      expect(repository.updated).toHaveBeenCalledWith('1', { name: 'John Doe' });
    })
    
    it('deve lançar erro ao tentar atualizar um usuário inexistente', async () => {
      jest.spyOn(repository, 'updated').mockResolvedValue(null);
  
      await expect(service.updated('99', { name: 'Novo Nome' })).rejects.toThrow(NotFoundException);
    });
  
    it('deve deletar um usuário', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
  
      await expect(service.delete('1')).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith('1');
    });
})
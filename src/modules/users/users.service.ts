import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExistsException } from 'src/common/http/exceptions';
import { In, Not, Repository } from  'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HashUtil } from 'src/common/utils/hash.util';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private rolesService: RolesService,
  ) {
  }

  public async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const userExists = await this.getUserByEmail(email);
    if (userExists) {
      throw new UserExistsException(email);
    }
    const user = this.userRepository.create(createUserDto);
    if (createUserDto.rolesIds) {
      const roles = await this.rolesService.getRolesByIds(createUserDto.rolesIds);
      user.roles = roles;
    }
    user.password = await HashUtil.encrypt(user.password);
    return this.userRepository.save(user);
  }

  async findAll() {
    const users: User[] = await this.userRepository.find();
    if (users.length === 0) throw new HttpException('No existen usuarios', HttpStatus.NOT_FOUND)
    return users;

  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id }, relations: ['roles'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });

    if (!userToUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const { email } = updateUserDto;

    if (email && email !== userToUpdate.email) {
      const userWithEmail = await this.userRepository.findOne({ where: { email } });
      if (userWithEmail) throw new UserExistsException(email)
    }

    const roles = updateUserDto.rolesIds ? await this.rolesService.getRolesByIds(updateUserDto.rolesIds) : null;

    this.userRepository.merge(userToUpdate, { ...updateUserDto, roles });

    return this.userRepository.save(userToUpdate);

  }

  async remove(id: string) {
    await this.userRepository.delete(id);
  }


  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}

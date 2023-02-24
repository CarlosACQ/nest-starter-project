import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExistsException } from 'src/common/http/exceptions';
import { HashUtil } from 'src/common/utils/hash.util';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private rolesService: RolesService,
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const userExists = await this.getUserByEmail(email);
    if (userExists) {
      throw new UserExistsException(email);
    }
    const user = this.userRepository.create(createUserDto);
    if (createUserDto.rolesIds) {
      const roles = await this.roleRepository.findByIds(createUserDto.rolesIds);
      user.roles = roles;
    }
    user.password = await HashUtil.encrypt(user.password);
    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}

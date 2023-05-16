import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const { name, description, isActive } = createRoleDto;
    const role = this.rolesRepository.create({
      name,
      description,
      isActive,
    });
    return this.rolesRepository.save(role);
  }

  async findAll() {
    return this.rolesRepository.find();
  }

  async findOne(id: string) {
    const role = await this.rolesRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    const { name, description, isActive } = updateRoleDto;
    role.name = name || role.name;
    role.description = description || role.description;
    role.isActive = isActive === undefined ? role.isActive : isActive;
    return this.rolesRepository.save(role);
  }

  async remove(id: string) {

    const role = await this.rolesRepository.findOne({
      where: { isActive: false, id },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    if (role.users && role.users.length > 0) {
      throw new BadRequestException(`Role with id ${id} has associated users`);
    }

    role.isActive = false;
    return this.rolesRepository.save(role);
  }

  public async getRolesByIds(ids: number[]): Promise<Role[]> {
    return this.rolesRepository.findBy({ id: In(ids) });
  }
}

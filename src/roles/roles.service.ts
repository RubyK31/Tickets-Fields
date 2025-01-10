import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repository/base.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private baseRepository: BaseRepository) {}

  // Create a new role
  async createRole(createRoleDto: CreateRoleDto) {
    const uniqueCheck = {
      role_name: createRoleDto.role_name,
    };
    return this.baseRepository.create('role', createRoleDto, uniqueCheck);
  }

  // Get all roles
  async getAllRoles(pageNumber: number) {
    const orderBy = { id: 'desc' };
    return this.baseRepository.findAll('role', pageNumber, orderBy);
  }

  // Get a role by ID
  async getRoleById(id: number) {
    return this.baseRepository.findById('role', id);
  }

  // Update an existing role by ID
  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const uniqueCheck = {
      role_name: updateRoleDto.role_name,
    };
    return this.baseRepository.update('role', id, updateRoleDto, uniqueCheck);
  }

  // Delete a role by ID
  async deleteRole(id: number) {
    return this.baseRepository.deleteById('role', id);
  }
}

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { AutoResolver } from '../../../lib';
import { Repository } from 'typeorm';
import { DeleteDTO } from '../utils/delete.dto';
import { Customer } from './customer.entity';
import { CreateCustomerDTO } from './dto/create.dto';
import { CustomerObjectType } from './dto/customer.dto';
import { UpdateCustomerDTO } from './dto/update.dto';

@AutoResolver(CustomerObjectType)
@Resolver(() => CustomerObjectType)
export class CustomerResolver {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  @Mutation(() => CustomerObjectType)
  async createCustomer(@Args('customer') data: CreateCustomerDTO) {
    const customer = await this.customerRepository.save(data);
    return customer;
  }

  @Mutation(() => CustomerObjectType)
  async updateCustomer(@Args('customer') data: UpdateCustomerDTO) {
    return this.customerRepository.save(data);
  }

  @Mutation(() => CustomerObjectType)
  async deleteCustomer(@Args('customer') data: DeleteDTO) {
    return this.customerRepository.save(data);
  }
}

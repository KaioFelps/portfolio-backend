import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../repositories/users-repository';
import { Either, ok } from '@/core/types/either';
import { PaginationParams } from '@/core/types/pagination-params';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { User } from '../entities/user';

interface FetchManyUsersServiceRequest extends PaginationParams {}

type FetchManyUsersServiceResponse = Either<
  null,
  { users: User[]; count: number }
>;

@Injectable()
export class FetchManyUsersService {
  constructor(private usersRepository: IUsersRepository) {}

  async exec({
    amount,
    page,
    query,
  }: FetchManyUsersServiceRequest): Promise<FetchManyUsersServiceResponse> {
    const response = await this.usersRepository.findMany({
      amount: amount ?? QUANTITY_PER_PAGE,
      page: page ?? 1,
      query,
    });

    return ok({
      users: response.value,
      count: response.totalCount,
    });
  }
}

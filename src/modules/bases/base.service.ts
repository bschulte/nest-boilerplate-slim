import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, DeepPartial } from 'typeorm';

export class BaseService<T> extends TypeOrmCrudService<T> {
  constructor(repo: Repository<T>) {
    super(repo);
  }

  async save(entry: DeepPartial<T>) {
    return this.repo.save(entry);
  }
}

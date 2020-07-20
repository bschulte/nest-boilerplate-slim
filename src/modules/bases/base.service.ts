import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository, DeepPartial } from 'typeorm';

/**
 * Base service that will be used for all other services in the app. Extends
 * the TypeOrmCrudService to utilize the convenience methods already there, but
 * also add our own common methods needed by the modules.
 */
export class BaseService<T> extends TypeOrmCrudService<T> {
  constructor(repo: Repository<T>) {
    super(repo);
  }

  async save(entry: DeepPartial<T>) {
    return this.repo.save(entry);
  }
}

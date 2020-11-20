import * as fs from 'fs';

function safeWriteFile(file: string, content: string) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
  }
}

(() => {
  const name: string = process.argv[2];
  const uppercaseName = name.charAt(0).toUpperCase() + name.slice(1);

  console.log(`Bootstrapping ${name}/${uppercaseName}`);

  // Folder first
  const dir = __dirname + '/../src/modules/' + name;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Entity
  const entity = `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ${uppercaseName} extends BaseEntity {
    @Column()
    value: string;
}`;
  safeWriteFile(dir + '/' + name + '.entity.ts', entity);

  // Service
  const service = `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../base.service';
import { ${uppercaseName} } from './${name}.entity';

import { ${uppercaseName} } from './${name}.entity';

@Injectable()
export class ${uppercaseName}Service extends BaseService<${uppercaseName}> {
  constructor(
    @InjectRepository(${uppercaseName}) repo,
  ) {
    super(repo);
  }
}`;

  safeWriteFile(dir + '/' + name + '.service.ts', service);

  // Controller
  const controller = `import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Crud, CrudAuth } from '@nestjsx/crud';

import { ${uppercaseName}Service } from './${name}.service';

@Crud({
  model: {
    type: ${uppercaseName}
  }
})
@CrudAuth()
@ApiTags('${name}')
@Controller('${name}')
export class ${uppercaseName}Controller {
  constructor(public service: ${uppercaseName}Service) {}
}`;
  safeWriteFile(dir + '/' + name + '.controller.ts', controller);

  // Module
  const module = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${uppercaseName} } from './${name}.entity';
import { ${uppercaseName}Service } from './${name}.service';
import { ${uppercaseName}Controller } from './${name}.controller';
import { ${uppercaseName}Resolver } from './${name}.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([${uppercaseName}])],
  controllers: [${uppercaseName}Controller],
  providers: [${uppercaseName}Service],
  exports: [${uppercaseName}Service]
})
export class ${uppercaseName}Module {}`;
  safeWriteFile(dir + '/' + name + '.module.ts', module);

  // Spec file
  const spec = `import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ${uppercaseName} } from './${name}.entity'
import { ${uppercaseName}Service } from './${name}.service';

describe('${uppercaseName}Service', () => {
  let ${name}Service: ${uppercaseName}Service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([${uppercaseName}])],
      providers: [${uppercaseName}Service]
    }).compile();

    ${name}Service = module.get<${uppercaseName}Service>(${uppercaseName}Service);
  });

});`;
  safeWriteFile(dir + '/' + name + '.service.spec.ts', spec);
})();

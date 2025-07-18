// presentation/http/modules/tourism.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourismController } from '../controllers/tourism.controller';
import { CreateTourismUseCase } from 'src/application/use-cases/tourism/create-tourism.use-case';
import { TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { ITourismRepository } from 'src/domain/repositories/tourism.repository';
import { TourismRepository } from 'src/infrastructure/repositories/tourism.repository';
import { Property } from 'src/domain/entities/property.entity';
import { Touristic } from 'src/domain/entities/touristic.entity';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';
import { AdditionalService } from 'src/domain/entities/additional-service.entity';
import { OfficeRepository } from 'src/infrastructure/repositories/office.repository';  
import { OFFICE_REPOSITORY } from "src/domain/repositories/office.repository";
import { Office } from "src/domain/entities/offices.entity";
import { OfficeSocial } from "src/domain/entities/office-social.entity";
import { AuthModule } from "./auth.module";
import {UpdateTourismUseCase} from 'src/application/use-cases/tourism/update-tourism.use-case';
import {ListTourismUseCase}from 'src/application/use-cases/tourism/list-tourism.use-case';
import { FilterTourismUseCase } from 'src/application/use-cases/tourism/filter-tourism.use-case';
import { Region } from 'src/domain/entities/region.entity';
import { SearchByTitleUseCase } from 'src/application/use-cases/tourism/search-by-title.use-case';
import { ShowTourismUseCase } from 'src/application/use-cases/tourism/show-tourism.use-case';
@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Office,
      OfficeSocial,
      Property,
      Touristic,
      PropertyPost,
      AdditionalService,
      Region,
    ]),
  ],
  controllers: [TourismController],
  providers: [
    CreateTourismUseCase,
    UpdateTourismUseCase,
    ListTourismUseCase,
    FilterTourismUseCase,
    SearchByTitleUseCase,
    ShowTourismUseCase,
    {
      provide: TOURISM_REPOSITORY,
      useClass: TourismRepository,
    },
   {
  provide: OFFICE_REPOSITORY,
  useClass: OfficeRepository,
   }

  ],
})
export class TourismModule {}

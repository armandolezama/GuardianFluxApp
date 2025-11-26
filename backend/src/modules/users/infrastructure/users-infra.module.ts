// backend/src/modules/users/infrastructure/users-infra.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './user.schema';
import { MongoUserRepository } from './user-mongo.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [
    { provide: 'UserRepository', useClass: MongoUserRepository },
  ],
  exports: ['UserRepository'],
})
export class UsersInfraModule {}

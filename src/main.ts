import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { envCongig } from './config/env.congig';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { UserRoles } from './enums';
import { Crypto } from './utils/Crypto';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function createSuperAdmin(app) {
  let dataSource = app.get(DataSource)
  let userRepo = dataSource.getRepository(User)
  let existedSuperAdmin = await userRepo.findOneBy({
    role: UserRoles.SUPERADMIN
  })
  let hashed_password = await Crypto.hash(envCongig.superadmin.password)
  if (!existedSuperAdmin) {
    let superAdmin = userRepo.create({
      full_name: envCongig.superadmin.full_name,
      age: envCongig.superadmin.age,
      password: hashed_password,
      phone_number: envCongig.superadmin.phone_number,
      role: UserRoles.SUPERADMIN
    })

    await userRepo.save(superAdmin)
    console.log(superAdmin)
  } else {
    console.log(`Superadmin : `, existedSuperAdmin)
  }
}
async function bootstrap() {
  let port = envCongig.port
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' })

  app.setGlobalPrefix(`api`)
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
  )

  await createSuperAdmin(app)
  
  await app.listen(port, () => console.log(`server is running on port`, port));

}
bootstrap();

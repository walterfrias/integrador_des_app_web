import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from './modules/auth/entities/usuario.entity';

const SEED_ADMIN = {
  nombre: 'admin',
  clave: 'adminintegrador',
  rol: RolUsuario.ADMIN,
};

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usuarioRepo = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));

  const existe = await usuarioRepo.findOneBy({ nombre: SEED_ADMIN.nombre });
  if (existe) {
    console.log(`El usuario "${SEED_ADMIN.nombre}" ya existe, no se crea de nuevo.`);
    await app.close();
    return;
  }

  const clave = await bcrypt.hash(SEED_ADMIN.clave, 10);
  const usuario = usuarioRepo.create({ ...SEED_ADMIN, clave });
  await usuarioRepo.save(usuario);

  console.log(`Usuario ADMIN "${SEED_ADMIN.nombre}" creado correctamente.`);
  await app.close();
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario, EstadoUsuario } from './modules/auth/entities/usuario.entity';
import { Cliente } from './modules/gestion/entities/cliente.entity';
import { Proyecto, EstadoProyecto } from './modules/gestion/entities/proyecto.entity';
import { EstadosClientesEnum } from './modules/gestion/enums/estados-clientes.enum';

const USUARIOS = [
  {
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@admin.com',
    clave: 'adminintegrador',
    rol: RolUsuario.ADMIN,
    estado: EstadoUsuario.ACTIVO,
  },
  {
    nombre: 'Operador',
    apellido: 'Prueba',
    email: 'operador@prueba.com',
    clave: 'operadorintegrador',
    rol: RolUsuario.OPERADOR,
    estado: EstadoUsuario.ACTIVO,
  },
];

const CLIENTES = [
  { nombre: 'Empresa Alpha S.A.', cuit: '30-71234567-0', direccion: 'Av. Corrientes 1234, CABA', estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Consultora Beta', cuit: '30-71234568-1', direccion: 'San Martín 456, Paraná', estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Proyecto Interno (Sin Cliente)', cuit: null, direccion: null, estado: EstadosClientesEnum.ACTIVO },
];

const PROYECTOS = [
  {
    nombre: 'Sistema de Facturación',
    estado: EstadoProyecto.ACTIVO,
    fechaLimite: new Date('2026-12-31'),
    clienteNombre: 'Empresa Alpha S.A.',
  },
  {
    nombre: 'Portal Web Corporativo',
    estado: EstadoProyecto.ACTIVO,
    fechaLimite: new Date('2026-08-01'),
    clienteNombre: 'Consultora Beta',
  },
  {
    nombre: 'Migración de Base de Datos',
    estado: EstadoProyecto.ACTIVO,
    fechaLimite: new Date('2026-03-01'),
    clienteNombre: null,
  },
  {
    nombre: 'App Mobile (Finalizado)',
    estado: EstadoProyecto.FINALIZADO,
    fechaLimite: null,
    clienteNombre: 'Empresa Alpha S.A.',
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usuarioRepo = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  const clienteRepo = app.get<Repository<Cliente>>(getRepositoryToken(Cliente));
  const proyectoRepo = app.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));

  // Usuarios
  for (const datos of USUARIOS) {
    const existe = await usuarioRepo.findOneBy({ email: datos.email });
    if (existe) {
      console.log(`Usuario "${datos.email}" ya existe, se omite.`);
      continue;
    }
    const clave = await bcrypt.hash(datos.clave, 10);
    await usuarioRepo.save(usuarioRepo.create({ ...datos, clave }));
    console.log(`Usuario "${datos.email}" creado (${datos.rol}).`);
  }

  // Clientes
  for (const datos of CLIENTES) {
    const existe = await clienteRepo.findOneBy({ nombre: datos.nombre });
    if (existe) {
      console.log(`Cliente "${datos.nombre}" ya existe, se omite.`);
      continue;
    }
    await clienteRepo.save(clienteRepo.create(datos));
    console.log(`Cliente "${datos.nombre}" creado.`);
  }

  // Proyectos
  for (const datos of PROYECTOS) {
    const existe = await proyectoRepo.findOneBy({ nombre: datos.nombre });
    if (existe) {
      console.log(`Proyecto "${datos.nombre}" ya existe, se omite.`);
      continue;
    }
    const cliente = datos.clienteNombre
      ? await clienteRepo.findOneBy({ nombre: datos.clienteNombre })
      : null;
    await proyectoRepo.save(proyectoRepo.create({
      nombre: datos.nombre,
      estado: datos.estado,
      fechaLimite: datos.fechaLimite,
      cliente,
    }));
    console.log(`Proyecto "${datos.nombre}" creado.`);
  }

  await app.close();
  console.log('Seed completado.');
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario, EstadoUsuario } from './modules/auth/entities/usuario.entity';
import { Cliente } from './modules/gestion/entities/cliente.entity';
import { Proyecto, EstadoProyecto } from './modules/gestion/entities/proyecto.entity';
import { Tarea, EstadoTarea } from './modules/gestion/entities/tarea.entity';
import { AsignacionProyecto } from './modules/gestion/entities/asignacion-proyecto.entity';
import { EstadosClientesEnum } from './modules/gestion/enums/estados-clientes.enum';
import { EstadoAsignacion } from './modules/gestion/enums/estados-asignacion.enum';

const USUARIOS = [
  {
    nombre: 'Admin',
    apellido: 'Sistema',
    email: 'admin@admin.com',
    cuil: '20-11111111-1',
    clave: 'adminintegrador',
    rol: RolUsuario.ADMIN,
    estado: EstadoUsuario.ACTIVO,
  },
  {
    nombre: 'Operador',
    apellido: 'Prueba',
    email: 'operador@prueba.com',
    cuil: '20-22222222-2',
    clave: 'operadorintegrador',
    rol: RolUsuario.OPERADOR,
    estado: EstadoUsuario.ACTIVO,
  },
  {
    nombre: 'Walter',
    apellido: 'Gómez',
    email: 'walter@prueba.com',
    cuil: '20-33333333-3',
    clave: 'walterintegrador',
    rol: RolUsuario.OPERADOR,
    estado: EstadoUsuario.ACTIVO,
  },
  {
    nombre: 'Lucía',
    apellido: 'Fernández',
    email: 'lucia@prueba.com',
    cuil: '27-44444444-4',
    clave: 'luciaintegrador',
    rol: RolUsuario.OPERADOR,
    estado: EstadoUsuario.ACTIVO,
  },
  {
    nombre: 'Martín',
    apellido: 'Rodríguez',
    email: 'martin@prueba.com',
    cuil: '20-55555555-5',
    clave: 'martinintegrador',
    rol: RolUsuario.OPERADOR,
    estado: EstadoUsuario.ACTIVO,
  },
  {
    nombre: 'Sofía',
    apellido: 'Martínez',
    email: 'sofia@prueba.com',
    cuil: '27-66666666-6',
    clave: 'sofiaintegrador',
    rol: RolUsuario.OPERADOR,
    estado: EstadoUsuario.ACTIVO,
  },
];

const CLIENTES = [
  { nombre: 'Empresa Alpha S.A.',              cuit: '30-71234567-0', direccion: 'Av. Corrientes 1234, CABA',                estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Consultora Beta',                  cuit: '30-71234568-1', direccion: 'San Martín 456, Paraná',                  estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Proyecto Interno (Sin Cliente)',   cuit: null,            direccion: null,                                      estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Constructora Del Sur S.A.',        cuit: '30-72000001-0', direccion: 'Av. San Martín 890, Rosario',             estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'TechSol Argentina S.R.L.',         cuit: '30-72000002-1', direccion: 'Av. Corrientes 3456, CABA',               estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Agropecuaria Los Pinos S.A.',      cuit: '30-72000003-2', direccion: 'Ruta 14 Km 30, Concordia',               estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Clínica Santa Rosa S.A.',          cuit: '30-72000004-3', direccion: 'Bv. Rondeau 1200, Paraná',               estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Instituto Tecnológico Litoral',    cuit: '30-72000005-4', direccion: 'Alameda de la Federación 106, Paraná',   estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Distribuidora Patagónica S.A.',    cuit: '30-72000006-5', direccion: 'Ruta 22 Km 1200, Neuquén',               estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Farmacia y Droguería Central',     cuit: '30-72000007-6', direccion: 'San Lorenzo 765, Rosario',               estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Estudio Jurídico Pérez & Asoc.',  cuit: '27-72000008-7', direccion: 'Florida 890, CABA',                      estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Ingeniería Aplicada S.R.L.',       cuit: '30-72000009-8', direccion: 'Av. del Ejército 1560, Mendoza',         estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Cooperativa Agropecuaria La Pampa',cuit: '30-72000010-9', direccion: 'Av. España 230, Santa Rosa',             estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Transportes Fluviales S.A.',       cuit: '30-72000011-0', direccion: 'Puerto Nuevo s/n, Paraná',               estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Servicios Ambientales del NEA',    cuit: '30-72000012-1', direccion: 'Av. 9 de Julio 890, Resistencia',        estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Editorial Universitaria',          cuit: '30-72000013-2', direccion: 'Corrientes 2037, CABA',                  estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Metalúrgica San Lorenzo S.A.',     cuit: '30-72000014-3', direccion: 'Ruta 9 Km 345, San Lorenzo',             estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Telecomunicaciones del Interior',  cuit: '30-72000015-4', direccion: 'Av. Vélez Sársfield 1234, Córdoba',      estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Laboratorio Bioquímico Norte',     cuit: '30-72000016-5', direccion: 'Av. Belgrano 1890, Tucumán',             estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Constructora Paraná S.R.L.',       cuit: '30-72000017-6', direccion: 'Bv. Racedo 2450, Paraná',               estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Software Factory Rosario S.R.L.',  cuit: '30-72000018-7', direccion: 'Av. Pellegrini 3456, Rosario',           estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Consultora de RRHH Sur',           cuit: '30-72000019-8', direccion: 'Hipólito Yrigoyen 1200, La Plata',       estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Grupo Hotelero del Litoral',       cuit: '30-72000020-9', direccion: 'Costanera s/n, Posadas',                 estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Empresa de Limpieza Industrial',   cuit: '30-72000021-0', direccion: 'Av. Circunvalación 5600, Córdoba',       estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Frigorífico Entrerriano S.A.',     cuit: '30-72000022-1', direccion: 'Ruta 12 Km 78, Gualeguaychú',           estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Seguridad Privada Horizonte',      cuit: '30-72000023-2', direccion: 'Colón 456, Santa Fe',                   estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Centro Médico Regional',           cuit: '30-72000024-3', direccion: 'Av. Ramírez 1800, Paraná',              estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Arquitectura y Diseño S.R.L.',     cuit: '30-72000025-4', direccion: 'Montevideo 890, CABA',                  estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Agencia de Publicidad Creativa',   cuit: '30-72000026-5', direccion: 'Av. del Libertador 4500, CABA',         estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Logística Integral S.A.',          cuit: '30-72000027-6', direccion: 'Av. Circunvalación 890, Rosario',       estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Escuela de Idiomas Global',        cuit: '27-72000028-7', direccion: 'Av. Colón 1234, Mar del Plata',         estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Clínica Odontológica Sonrisa',     cuit: '27-72000029-8', direccion: 'San Martín 567, Paraná',                estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Desarrolladora Inmobiliaria Norte',cuit: '30-72000030-9', direccion: 'Urquiza 2100, Paraná',                  estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Servicios IT Federación S.R.L.',   cuit: '30-72000031-0', direccion: '25 de Mayo 780, Concordia',             estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Cooperativa de Trabajo Digital',   cuit: '30-72000032-1', direccion: 'Av. Independencia 3400, CABA',          estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Productora Audiovisual Litoral',   cuit: '30-72000033-2', direccion: 'Laprida 890, Paraná',                   estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Centro de Capacitación Empresarial',cuit:'30-72000034-3', direccion: 'Av. Misioneros 1200, Posadas',          estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Empresa de Gas Natural del Sur',   cuit: '30-72000035-4', direccion: 'Belgrano 2300, Neuquén',                estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Importadora y Exportadora S.A.',   cuit: '30-72000036-5', direccion: 'Av. Pres. Perón 5600, La Matanza',      estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Servicios Contables Integrados',   cuit: '27-72000037-6', direccion: 'Corrientes 1890, CABA',                 estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Mutual de Empleados Públicos',     cuit: '30-72000038-7', direccion: 'Larrea 456, Paraná',                    estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Agro Insumos del Centro',          cuit: '30-72000039-8', direccion: 'Ruta 8 Km 250, Río Cuarto',             estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Constructora Vial del Norte',      cuit: '30-72000040-9', direccion: 'Av. Alvear 1234, Resistencia',          estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Centro de Salud Integral',         cuit: '30-72000041-0', direccion: 'Urquiza 890, Concepción del Uruguay',   estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Planta Industrial Litoral S.A.',   cuit: '30-72000042-1', direccion: 'Parque Industrial s/n, Zárate',         estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Servicios Veterinarios del Campo', cuit: '27-72000043-2', direccion: 'Ruta 14 Km 120, Federal',               estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Consulting Group BA S.A.',         cuit: '30-72000044-3', direccion: 'Av. Madero 1020, CABA',                 estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Red de Farmacias Noroeste',        cuit: '30-72000045-4', direccion: 'San Martín 234, Jujuy',                 estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Soluciones Financieras Córdoba',   cuit: '30-72000046-5', direccion: 'Av. Colón 3456, Córdoba',               estado: EstadosClientesEnum.ACTIVO },
  { nombre: 'Energía Renovable del Litoral',    cuit: '30-72000047-6', direccion: 'Av. Las Heras 789, Paraná',             estado: EstadosClientesEnum.ACTIVO },
];

const PROYECTOS = [
  { nombre: 'Sistema de Facturación',          estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-12-31'), clienteNombre: 'Empresa Alpha S.A.' },
  { nombre: 'Portal Web Corporativo',          estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-08-01'), clienteNombre: 'Consultora Beta' },
  { nombre: 'Migración de Base de Datos',      estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-03-01'), clienteNombre: null },
  { nombre: 'App Mobile (Finalizado)',         estado: EstadoProyecto.FINALIZADO,  fechaLimite: null,                   clienteNombre: 'Empresa Alpha S.A.' },
  { nombre: 'Plataforma E-commerce',           estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-09-30'), clienteNombre: 'TechSol Argentina S.R.L.' },
  { nombre: 'Sistema de Gestión Hospitalaria', estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-11-30'), clienteNombre: 'Clínica Santa Rosa S.A.' },
  { nombre: 'Rediseño de Infraestructura TI', estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-07-15'), clienteNombre: 'Transportes Fluviales S.A.' },
  { nombre: 'ERP Agropecuario',               estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2027-01-31'), clienteNombre: 'Agropecuaria Los Pinos S.A.' },
  { nombre: 'Portal de Empleados',            estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-10-01'), clienteNombre: 'Mutual de Empleados Públicos' },
  { nombre: 'Sistema de Turnos Online',       estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-08-15'), clienteNombre: 'Centro Médico Regional' },
  { nombre: 'Digitalización de Archivos',     estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-06-30'), clienteNombre: 'Instituto Tecnológico Litoral' },
  { nombre: 'App de Logística',               estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-12-01'), clienteNombre: 'Logística Integral S.A.' },
  { nombre: 'Sistema Contable Integrado',     estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-09-01'), clienteNombre: 'Servicios Contables Integrados' },
  { nombre: 'Dashboard de Métricas',          estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-08-01'), clienteNombre: 'Consulting Group BA S.A.' },
  { nombre: 'Plataforma de Capacitación',     estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-11-01'), clienteNombre: 'Centro de Capacitación Empresarial' },
  { nombre: 'API REST para Distribución',     estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-10-15'), clienteNombre: 'Distribuidora Patagónica S.A.' },
  { nombre: 'Migración a la Nube',            estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-12-31'), clienteNombre: 'Metalúrgica San Lorenzo S.A.' },
  { nombre: 'Facturación Electrónica AFIP',   estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-07-01'), clienteNombre: 'Frigorífico Entrerriano S.A.' },
  { nombre: 'Rediseño Portal Institucional',  estado: EstadoProyecto.ACTIVO,     fechaLimite: new Date('2026-09-30'), clienteNombre: 'Consultora Beta' },
  { nombre: 'Integración con AFIP',           estado: EstadoProyecto.FINALIZADO,  fechaLimite: null,                   clienteNombre: 'Empresa Alpha S.A.' },
];

const TAREAS: { descripcion: string; estado: EstadoTarea; proyectoNombre: string; responsableEmail: string | null; fechaCreacion?: Date }[] = [
  // Sistema de Facturación
  { descripcion: 'Relevamiento de requerimientos con el cliente',         estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Sistema de Facturación',          responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-02-18') },
  { descripcion: 'Diseño del modelo de base de datos',                    estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Sistema de Facturación',          responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-02-25') },
  { descripcion: 'Implementar módulo de emisión de facturas',             estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Sistema de Facturación',          responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-03-04') },

  // Portal Web Corporativo
  { descripcion: 'Diseño de mockups y wireframes',                        estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Portal Web Corporativo',          responsableEmail: 'sofia@prueba.com',    fechaCreacion: new Date('2026-02-18') },
  { descripcion: 'Desarrollo de componentes frontend',                    estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Portal Web Corporativo',          responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-02-25') },
  { descripcion: 'Integración con CMS',                                   estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Portal Web Corporativo',          responsableEmail: 'operador@prueba.com', fechaCreacion: new Date('2026-03-04') },

  // Migración de Base de Datos
  { descripcion: 'Auditoría de la base de datos actual',                  estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Migración de Base de Datos',      responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-02-25') },
  { descripcion: 'Generar scripts de migración',                          estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Migración de Base de Datos',      responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-03-04') },
  { descripcion: 'Pruebas de integridad post-migración',                  estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Migración de Base de Datos',      responsableEmail: null,                  fechaCreacion: new Date('2026-03-11') },

  // Plataforma E-commerce
  { descripcion: 'Configurar pasarela de pagos',                          estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Plataforma E-commerce',           responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-03-18') },
  { descripcion: 'Implementar catálogo de productos',                     estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Plataforma E-commerce',           responsableEmail: 'sofia@prueba.com',    fechaCreacion: new Date('2026-03-17') },
  { descripcion: 'Desarrollo del carrito de compras',                     estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Plataforma E-commerce',           responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-03-25') },

  // Sistema de Gestión Hospitalaria
  { descripcion: 'Módulo de historia clínica digital',                    estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Sistema de Gestión Hospitalaria', responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-02-18') },
  { descripcion: 'Sistema de gestión de turnos',                          estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Sistema de Gestión Hospitalaria', responsableEmail: 'operador@prueba.com', fechaCreacion: new Date('2026-02-25') },
  { descripcion: 'Integración con laboratorio',                           estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Sistema de Gestión Hospitalaria', responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-03-04') },

  // Rediseño de Infraestructura TI
  { descripcion: 'Inventario de infraestructura actual',                  estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Rediseño de Infraestructura TI',  responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-03-10') },
  { descripcion: 'Propuesta de arquitectura nueva',                       estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Rediseño de Infraestructura TI',  responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-03-10') },
  { descripcion: 'Implementar nueva infraestructura',                     estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Rediseño de Infraestructura TI',  responsableEmail: 'sofia@prueba.com',    fechaCreacion: new Date('2026-03-18') },

  // ERP Agropecuario
  { descripcion: 'Análisis de procesos del negocio agropecuario',         estado: EstadoTarea.FINALIZADA, proyectoNombre: 'ERP Agropecuario',                responsableEmail: 'operador@prueba.com', fechaCreacion: new Date('2026-03-03') },
  { descripcion: 'Módulo de gestión de stock',                            estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'ERP Agropecuario',                responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-03-11') },
  { descripcion: 'Módulo de ventas y remitos',                            estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'ERP Agropecuario',                responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-03-18') },

  // Portal de Empleados
  { descripcion: 'Módulo de liquidación de sueldos',                      estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Portal de Empleados',             responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-02-25') },
  { descripcion: 'Gestión de licencias y ausencias',                      estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Portal de Empleados',             responsableEmail: 'sofia@prueba.com',    fechaCreacion: new Date('2026-03-04') },
  { descripcion: 'Notificaciones y comunicados internos',                 estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Portal de Empleados',             responsableEmail: null,                  fechaCreacion: new Date('2026-03-11') },

  // Sistema de Turnos Online
  { descripcion: 'Calendario interactivo de disponibilidad',              estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Sistema de Turnos Online',        responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-03-18') },
  { descripcion: 'Recordatorios automáticos por email',                   estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Sistema de Turnos Online',        responsableEmail: 'operador@prueba.com', fechaCreacion: new Date('2026-03-25') },
  { descripcion: 'Historial de turnos por paciente',                      estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Sistema de Turnos Online',        responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-03-25') },

  // Digitalización de Archivos
  { descripcion: 'Escaneo y clasificación de documentos físicos',         estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Digitalización de Archivos',      responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-03-24') },
  { descripcion: 'Implementar buscador de documentos',                    estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Digitalización de Archivos',      responsableEmail: 'sofia@prueba.com',    fechaCreacion: new Date('2026-04-01') },
  { descripcion: 'Control de acceso por perfil',                          estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Digitalización de Archivos',      responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-04-01') },

  // App de Logística
  { descripcion: 'Módulo de seguimiento de envíos en tiempo real',        estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'App de Logística',                responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-04-07') },
  { descripcion: 'Gestión de rutas y conductores',                        estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'App de Logística',                responsableEmail: 'operador@prueba.com', fechaCreacion: new Date('2026-04-07') },
  { descripcion: 'Reportes de tiempos de entrega',                        estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'App de Logística',                responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-04-14') },

  // Sistema Contable Integrado
  { descripcion: 'Importación de asientos contables',                     estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Sistema Contable Integrado',      responsableEmail: 'sofia@prueba.com',    fechaCreacion: new Date('2026-03-31') },
  { descripcion: 'Generación de balance y estado de resultados',          estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Sistema Contable Integrado',      responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-04-07') },
  { descripcion: 'Exportación a Excel y PDF',                             estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Sistema Contable Integrado',      responsableEmail: null,                  fechaCreacion: new Date('2026-04-07') },

  // Dashboard de Métricas
  { descripcion: 'Definir KPIs con el cliente',                           estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Dashboard de Métricas',           responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-03-31') },
  { descripcion: 'Integración con fuentes de datos externas',             estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Dashboard de Métricas',           responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-04-07') },
  { descripcion: 'Diseño de gráficos interactivos',                       estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Dashboard de Métricas',           responsableEmail: 'operador@prueba.com', fechaCreacion: new Date('2026-04-14') },

  // Plataforma de Capacitación
  { descripcion: 'Módulo de cursos y contenidos multimedia',              estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Plataforma de Capacitación',      responsableEmail: 'sofia@prueba.com',    fechaCreacion: new Date('2026-04-14') },
  { descripcion: 'Sistema de evaluaciones y certificados',                estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Plataforma de Capacitación',      responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-04-21') },
  { descripcion: 'Seguimiento de progreso del alumno',                    estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Plataforma de Capacitación',      responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-04-21') },

  // API REST para Distribución
  { descripcion: 'Diseño de endpoints y contratos de API',                estado: EstadoTarea.FINALIZADA, proyectoNombre: 'API REST para Distribución',      responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-04-07') },
  { descripcion: 'Autenticación y autorización con JWT',                  estado: EstadoTarea.FINALIZADA, proyectoNombre: 'API REST para Distribución',      responsableEmail: 'sofia@prueba.com',    fechaCreacion: new Date('2026-04-14') },
  { descripcion: 'Documentación con Swagger',                             estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'API REST para Distribución',      responsableEmail: 'operador@prueba.com', fechaCreacion: new Date('2026-04-21') },

  // Migración a la Nube
  { descripcion: 'Evaluación de proveedor cloud',                         estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Migración a la Nube',             responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-04-14') },
  { descripcion: 'Configuración de entornos en AWS',                      estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Migración a la Nube',             responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-04-21') },
  { descripcion: 'Plan de contingencia y rollback',                       estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Migración a la Nube',             responsableEmail: null,                  fechaCreacion: new Date('2026-04-28') },

  // Facturación Electrónica AFIP
  { descripcion: 'Integración con web services de AFIP',                  estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Facturación Electrónica AFIP',    responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-04-21') },
  { descripcion: 'Generación de CAE y CAEA',                              estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Facturación Electrónica AFIP',    responsableEmail: 'sofia@prueba.com',    fechaCreacion: new Date('2026-04-28') },
  { descripcion: 'Testing en homologación AFIP',                          estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Facturación Electrónica AFIP',    responsableEmail: 'operador@prueba.com', fechaCreacion: new Date('2026-04-28') },

  // Rediseño Portal Institucional
  { descripcion: 'Análisis SEO y performance actual',                     estado: EstadoTarea.FINALIZADA, proyectoNombre: 'Rediseño Portal Institucional',   responsableEmail: 'walter@prueba.com',   fechaCreacion: new Date('2026-05-05') },
  { descripcion: 'Nuevas secciones y estructura de contenidos',           estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Rediseño Portal Institucional',   responsableEmail: 'lucia@prueba.com',    fechaCreacion: new Date('2026-05-05') },
  { descripcion: 'Optimización para dispositivos móviles',                estado: EstadoTarea.PENDIENTE,  proyectoNombre: 'Rediseño Portal Institucional',   responsableEmail: 'martin@prueba.com',   fechaCreacion: new Date('2026-05-12') },
];

const ASIGNACIONES: { usuarioEmail: string; proyectoNombre: string; estado: EstadoAsignacion; fechaAsignacion: Date }[] = [
  // Sistema de Facturación
  { usuarioEmail: 'walter@prueba.com',   proyectoNombre: 'Sistema de Facturación',          estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-01-10') },
  { usuarioEmail: 'lucia@prueba.com',    proyectoNombre: 'Sistema de Facturación',          estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-01-10') },

  // Portal Web Corporativo
  { usuarioEmail: 'sofia@prueba.com',    proyectoNombre: 'Portal Web Corporativo',          estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-01') },
  { usuarioEmail: 'martin@prueba.com',   proyectoNombre: 'Portal Web Corporativo',          estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-01') },

  // Migración de Base de Datos
  { usuarioEmail: 'operador@prueba.com', proyectoNombre: 'Migración de Base de Datos',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-01-20') },
  { usuarioEmail: 'walter@prueba.com',   proyectoNombre: 'Migración de Base de Datos',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-01-20') },

  // App Mobile (proyecto finalizado — asignaciones en baja)
  { usuarioEmail: 'martin@prueba.com',   proyectoNombre: 'App Mobile (Finalizado)',         estado: EstadoAsignacion.BAJA,   fechaAsignacion: new Date('2025-06-01') },
  { usuarioEmail: 'sofia@prueba.com',    proyectoNombre: 'App Mobile (Finalizado)',         estado: EstadoAsignacion.BAJA,   fechaAsignacion: new Date('2025-06-01') },

  // Plataforma E-commerce
  { usuarioEmail: 'walter@prueba.com',   proyectoNombre: 'Plataforma E-commerce',           estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-05') },
  { usuarioEmail: 'lucia@prueba.com',    proyectoNombre: 'Plataforma E-commerce',           estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-05') },
  { usuarioEmail: 'sofia@prueba.com',    proyectoNombre: 'Plataforma E-commerce',           estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-10') },

  // Sistema de Gestión Hospitalaria
  { usuarioEmail: 'martin@prueba.com',   proyectoNombre: 'Sistema de Gestión Hospitalaria', estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-15') },
  { usuarioEmail: 'operador@prueba.com', proyectoNombre: 'Sistema de Gestión Hospitalaria', estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-15') },

  // Rediseño de Infraestructura TI
  { usuarioEmail: 'lucia@prueba.com',    proyectoNombre: 'Rediseño de Infraestructura TI',  estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-01-25') },
  { usuarioEmail: 'martin@prueba.com',   proyectoNombre: 'Rediseño de Infraestructura TI',  estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-01-25') },

  // ERP Agropecuario
  { usuarioEmail: 'walter@prueba.com',   proyectoNombre: 'ERP Agropecuario',                estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-01') },
  { usuarioEmail: 'sofia@prueba.com',    proyectoNombre: 'ERP Agropecuario',                estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-01') },

  // Portal de Empleados
  { usuarioEmail: 'operador@prueba.com', proyectoNombre: 'Portal de Empleados',             estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-20') },
  { usuarioEmail: 'lucia@prueba.com',    proyectoNombre: 'Portal de Empleados',             estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-20') },

  // Sistema de Turnos Online
  { usuarioEmail: 'walter@prueba.com',   proyectoNombre: 'Sistema de Turnos Online',        estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-15') },
  { usuarioEmail: 'martin@prueba.com',   proyectoNombre: 'Sistema de Turnos Online',        estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-15') },

  // Digitalización de Archivos
  { usuarioEmail: 'sofia@prueba.com',    proyectoNombre: 'Digitalización de Archivos',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-10') },
  { usuarioEmail: 'operador@prueba.com', proyectoNombre: 'Digitalización de Archivos',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-10') },

  // App de Logística
  { usuarioEmail: 'lucia@prueba.com',    proyectoNombre: 'App de Logística',                estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-01') },
  { usuarioEmail: 'walter@prueba.com',   proyectoNombre: 'App de Logística',                estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-01') },

  // Sistema Contable Integrado
  { usuarioEmail: 'martin@prueba.com',   proyectoNombre: 'Sistema Contable Integrado',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-20') },
  { usuarioEmail: 'sofia@prueba.com',    proyectoNombre: 'Sistema Contable Integrado',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-20') },

  // Dashboard de Métricas
  { usuarioEmail: 'operador@prueba.com', proyectoNombre: 'Dashboard de Métricas',           estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-05') },
  { usuarioEmail: 'walter@prueba.com',   proyectoNombre: 'Dashboard de Métricas',           estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-05') },

  // Plataforma de Capacitación
  { usuarioEmail: 'lucia@prueba.com',    proyectoNombre: 'Plataforma de Capacitación',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-10') },
  { usuarioEmail: 'martin@prueba.com',   proyectoNombre: 'Plataforma de Capacitación',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-10') },

  // API REST para Distribución
  { usuarioEmail: 'sofia@prueba.com',    proyectoNombre: 'API REST para Distribución',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-25') },
  { usuarioEmail: 'operador@prueba.com', proyectoNombre: 'API REST para Distribución',      estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-03-25') },

  // Migración a la Nube
  { usuarioEmail: 'walter@prueba.com',   proyectoNombre: 'Migración a la Nube',             estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-15') },
  { usuarioEmail: 'lucia@prueba.com',    proyectoNombre: 'Migración a la Nube',             estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-15') },

  // Facturación Electrónica AFIP
  { usuarioEmail: 'martin@prueba.com',   proyectoNombre: 'Facturación Electrónica AFIP',    estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-05') },
  { usuarioEmail: 'sofia@prueba.com',    proyectoNombre: 'Facturación Electrónica AFIP',    estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-02-05') },

  // Rediseño Portal Institucional
  { usuarioEmail: 'operador@prueba.com', proyectoNombre: 'Rediseño Portal Institucional',   estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-20') },
  { usuarioEmail: 'walter@prueba.com',   proyectoNombre: 'Rediseño Portal Institucional',   estado: EstadoAsignacion.ACTIVO, fechaAsignacion: new Date('2026-04-20') },

  // Integración con AFIP (proyecto finalizado — asignaciones en baja)
  { usuarioEmail: 'lucia@prueba.com',    proyectoNombre: 'Integración con AFIP',            estado: EstadoAsignacion.BAJA,   fechaAsignacion: new Date('2025-09-01') },
  { usuarioEmail: 'martin@prueba.com',   proyectoNombre: 'Integración con AFIP',            estado: EstadoAsignacion.BAJA,   fechaAsignacion: new Date('2025-09-01') },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usuarioRepo     = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  const clienteRepo     = app.get<Repository<Cliente>>(getRepositoryToken(Cliente));
  const proyectoRepo    = app.get<Repository<Proyecto>>(getRepositoryToken(Proyecto));
  const tareaRepo       = app.get<Repository<Tarea>>(getRepositoryToken(Tarea));
  const asignacionRepo  = app.get<Repository<AsignacionProyecto>>(getRepositoryToken(AsignacionProyecto));
  const dataSource      = app.get(DataSource);

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

  // Tareas
  for (const datos of TAREAS) {
    const proyecto = await proyectoRepo.findOneBy({ nombre: datos.proyectoNombre });
    if (!proyecto) {
      console.log(`Proyecto "${datos.proyectoNombre}" no encontrado, tarea omitida.`);
      continue;
    }
    let tarea: Tarea;
    const existe = await tareaRepo.findOneBy({ descripcion: datos.descripcion, proyecto: { id: proyecto.id } });
    if (existe) {
      tarea = existe;
      console.log(`Tarea "${datos.descripcion}" ya existe.`);
    } else {
      const responsable = datos.responsableEmail
        ? await usuarioRepo.findOneBy({ email: datos.responsableEmail })
        : null;
      tarea = await tareaRepo.save(tareaRepo.create({
        descripcion: datos.descripcion,
        estado: datos.estado,
        proyecto,
        responsable,
      }));
      console.log(`Tarea creada: "${datos.descripcion}"`);
    }
    if (datos.fechaCreacion) {
      await dataSource.query(
        'UPDATE tareas SET fecha_creacion = $1 WHERE id = $2',
        [datos.fechaCreacion, tarea.id],
      );
    }
  }

  // Asignaciones
  for (const datos of ASIGNACIONES) {
    const usuario = await usuarioRepo.findOneBy({ email: datos.usuarioEmail });
    const proyecto = await proyectoRepo.findOneBy({ nombre: datos.proyectoNombre });
    if (!usuario || !proyecto) {
      console.log(`Asignación omitida: usuario "${datos.usuarioEmail}" o proyecto "${datos.proyectoNombre}" no encontrado.`);
      continue;
    }
    const existe = await asignacionRepo.findOne({ where: { usuario: { id: usuario.id }, proyecto: { id: proyecto.id } } });
    if (existe) {
      console.log(`Asignación "${datos.usuarioEmail}" → "${datos.proyectoNombre}" ya existe, se omite.`);
      continue;
    }
    await asignacionRepo.save(asignacionRepo.create({
      usuario,
      proyecto,
      estado: datos.estado,
      fechaAsignacion: datos.fechaAsignacion,
    }));
    console.log(`Asignación creada: "${datos.usuarioEmail}" → "${datos.proyectoNombre}"`);
  }

  await app.close();
  console.log('\nSeed completado.');
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});

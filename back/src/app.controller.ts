import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  info() {
    return {
      nombre: 'API Sistema de Gestión de Proyectos',
      version: 'v1',
      endpoints: {
        auth: {
          'POST /api/v1/auth': 'Iniciar sesión',
        },
        usuarios: {
          'GET /api/v1/usuarios': 'Listar usuarios',
          'POST /api/v1/usuarios': 'Crear usuario',
          'PUT /api/v1/usuarios/:id': 'Actualizar usuario',
        },
        clientes: {
          'GET /api/v1/clientes': 'Listar clientes',
          'POST /api/v1/clientes': 'Crear cliente',
          'PUT /api/v1/clientes/:id': 'Actualizar cliente',
        },
        proyectos: {
          'GET /api/v1/proyectos': 'Listar proyectos',
          'GET /api/v1/proyectos/:id': 'Obtener proyecto',
          'POST /api/v1/proyectos': 'Crear proyecto',
          'PUT /api/v1/proyectos/:id': 'Actualizar proyecto',
        },
        tareas: {
          'POST /api/v1/proyectos/:idProyecto/tareas': 'Crear tarea',
          'PUT /api/v1/proyectos/:idProyecto/tareas/:id': 'Actualizar tarea',
        },
      },
      documentacion: 'Activar SWAGGER_HABILITADO=true para documentación interactiva en /api/v1',
    };
  }
}

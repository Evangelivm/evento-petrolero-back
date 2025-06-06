// app.controller.ts
import {
  Controller,
  Get,
  Options,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'API en funcionamiento'; // Mensaje de prueba
  }
  @Options() // Maneja todas las peticiones OPTIONS
  handleOptions() {
    return new HttpException('OK', HttpStatus.NO_CONTENT);
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/registration.dto.js';
import { LoginDto } from './dto/login.dto.js';
import {
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { AuthenticatedRequest } from './interfaces/authenticated-request.interface.js';

import { JwtAuthGuard } from './jwt-auth.guard.js';
import { CurrentUser } from './decorator/current-user.decorator.js';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Get('me')

  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() request: AuthenticatedRequest) {
    return request.user;
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
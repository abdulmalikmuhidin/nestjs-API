import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user returned' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() request: AuthenticatedRequest) {
    return request.user;
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and receive a JWT' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
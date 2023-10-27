import { Controller, Get, Render, Post, UseGuards, Body, Res, Req, Query } from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';



@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private roleService: RolesService) { }
    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({type: UserLoginDto})
    @Post('/login')
    @ResponseMessage("User Login")
    handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage('Register a new user')
    @Post('/register')
    registerUser(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto)
    }

    @ResponseMessage("Get user information")
    @Get('/account')
    async getUserData(@User() user: IUser) {
        const temp = await this.roleService.findOne(user.role._id) as any;
        user.permissions = temp.permissions
        return { user };
    }
    @Public()
    @ResponseMessage("Refresh user token")
    @Get('/refresh')
    refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies["refresh_token"]
        return this.authService.processNewToken(refreshToken, response);
    }
    @ResponseMessage("Logout User")
    @Post("/logout")
    handleLogout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {
        return this.authService.logout(response, user)
    }

}

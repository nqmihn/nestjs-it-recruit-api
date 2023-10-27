import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService, private configService: ConfigService, private rolesService: RolesService) { }
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password)
            if (isValid === true) {
                const userRole = user.role as unknown as { _id: string; name: string }
                const temp = await this.rolesService.findOne(userRole._id)
                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }
                return objUser;
            }

        }
        return null;
    }
    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        const refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refresh_token, _id);
        // set cookies
        response.cookie('refresh_token', refresh_token,
            {
                httpOnly: true,
                maxAge: ms(this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRE"))
            }
        )
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }

        };
    }
    async register(registerUserDto: RegisterUserDto) {
        let newUser = await this.usersService.register(registerUserDto)
        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
    }
    createRefreshToken = (payload) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) / 1000
        })
        return refreshToken
    }
    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            })
            let user = await this.usersService.findUserByToken(refreshToken)
            if (user) {
                // update refresh_token
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };
                const refresh_token = this.createRefreshToken(payload);
                await this.usersService.updateUserToken(refresh_token, _id.toString());
                // fetch user's role
                const userRole = user.role as unknown as { _id: string; name: string }
                const temp = await this.rolesService.findOne(userRole._id)
                // clear old cookies
                response.clearCookie('refresh_token')
                // set cookies
                response.cookie('refresh_token', refresh_token,
                    {
                        httpOnly: true,
                        maxAge: ms(this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRE"))
                    }
                )
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: temp?.permissions ?? []
                    }

                };
            } else {
                throw new BadRequestException("Token không hợp lệ. Vui lòng đăng nhập lại")
            }
        } catch (error) {
            throw new BadRequestException("Token không hợp lệ. Vui lòng đăng nhập lại")
        }
    }
    logout = async (response: Response, user: IUser) => {
        response.clearCookie('refresh_token');
        await this.usersService.updateUserToken("", user._id)
        return "ok"
    }
}

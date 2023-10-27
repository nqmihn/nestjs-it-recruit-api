import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'
import mongoose from 'mongoose';
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}
export class CreateUserDto {
    @IsNotEmpty({ message: "Vui lòng nhập tên" })
    name: string;

    @IsEmail({}, { message: "Vui lòng nhập đúng định dạng Email" })
    @IsNotEmpty({ message: "Vui lòng nhập Email" })
    email: string;

    @IsNotEmpty({ message: "Vui lòng nhập mật khẩu" })
    password: string;

    @IsNotEmpty({ message: "Vui lòng nhập tuổi" })
    age: number;

    @IsNotEmpty({ message: "Vui lòng nhập giới tính" })
    gender: string;

    @IsNotEmpty({ message: "Vui lòng nhập địa chỉ" })
    address: string;

    @IsNotEmpty({ message: "Vui lòng nhập Role" })
    @IsMongoId({ message: "Role phải có định dạng mongo id" })
    role: mongoose.Schema.Types.ObjectId;


    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}
export class RegisterUserDto {
    @IsNotEmpty({ message: "Vui lòng nhập tên của bạn" })
    name: string;

    @IsEmail({}, { message: "Vui lòng nhập đúng định dạng Email" })
    @IsNotEmpty({ message: "Vui lòng nhập Email" })
    email: string;

    @IsNotEmpty({ message: "Vui lòng nhập mật khẩu" })
    password: string;

    @IsNotEmpty({ message: "Vui lòng nhập tuổi của bạn" })
    age: number;

    @IsNotEmpty({ message: "Vui lòng nhập giới tính của bạn" })
    gender: string;

    @IsNotEmpty({ message: "Vui lòng nhập địa chỉ của bạn" })
    address: string;
}
export class UserLoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'admin@gmail.com', description: 'username' })
    readonly username: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
    example: '123456',
    description: 'password',
    })
    readonly password: string;
    }

import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {

    @IsNotEmpty({ message: "Vui lòng nhập Tên" })
    name: string;

    @IsNotEmpty({ message: "Vui lòng nhập Địa chỉ" })
    address: string;

    @IsNotEmpty({ message: "Vui lòng nhập Mô tả" })
    description: string;
}


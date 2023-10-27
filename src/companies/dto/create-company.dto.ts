import { IsEmail, IsNotEmpty } from 'class-validator'
export class CreateCompanyDto {

    @IsNotEmpty({ message: "Vui lòng nhập Tên" })
    name: string;

    @IsNotEmpty({ message: "Vui lòng nhập Địa chỉ" })
    address: string;

    @IsNotEmpty({ message: "Vui lòng nhập Mô tả" })
    description: string;

    @IsNotEmpty({ message: "Vui lòng upload Logo" })
    logo: string;
}

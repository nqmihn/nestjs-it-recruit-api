import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({ message: "Vui lòng nhập name" })
    name: string;

    @IsNotEmpty({ message: "email không được để trống" })
    @IsEmail({}, { message: "Định dạng email không hợp lệ" })
    email: string;

    @IsNotEmpty({ message: "Skill không được để trống" })
    @IsArray({ message: "Skill phải có định dạng array" })
    @IsString({ each: true, message: "Skill phải có định dạng là string" })
    skills: string[];
}

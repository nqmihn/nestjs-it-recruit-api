import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    logo: string;
}
export class CreateJobDto {
    @IsNotEmpty({ message: "Vui lòng nhập tên" })
    name: string;


    @IsNotEmpty({ message: "Skill không được để trống" })
    @IsArray({ message: "Skill truyền vào phải là một array" })
    @IsString({ each: true, message: "Skill phải là string" })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject({ message: "Company phải là một Object" })
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: "Vui lòng nhập lương" })
    salary: number;

    @IsNotEmpty({ message: "Vui lòng nhập số lượng" })
    quantity: number;

    @IsNotEmpty({ message: "Vui lòng nhập level" })
    level: string;

    @IsNotEmpty({ message: "Vui lòng nhập mô tả" })
    description: string;

    @IsNotEmpty({ message: "Vui lòng nhập địa chỉ" })
    location: string;

    @IsNotEmpty({ message: "Vui lòng nhập startDate" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'startDate phải có định dạng là Date' })
    startDate: Date;

    @IsNotEmpty({ message: "Vui lòng nhập endDate" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "endDate phải có định dạng là Date" })
    endDate: Date;

    @IsNotEmpty({ message: "Vui lòng nhập isActive" })
    @IsBoolean({ message: 'isActive phải có định dạng là Boolean' })
    isActive: boolean;



}
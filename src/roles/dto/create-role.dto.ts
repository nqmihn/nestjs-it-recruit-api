import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: "Vui lòng nhập name" })
    name: string;

    @IsNotEmpty({ message: "description không được để trống" })
    description: string;

    @IsNotEmpty({ message: "Vui lòng nhập isActive" })
    @IsBoolean({ message: 'isActive phải thuộc kiểu Boolean' })
    isActive: boolean;

    @IsNotEmpty({ message: "Vui lòng nhập permissions" })
    @IsMongoId({ each: true, message: "Permission phải thuộc kiểu mongo id" })
    @IsArray({ message: 'permission phải có định dạng là array' })
    permissions: mongoose.Schema.Types.ObjectId[];

}

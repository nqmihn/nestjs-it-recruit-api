import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
    @IsNotEmpty({ message: "Vui lòng nhập name" })
    name: string;

    @IsNotEmpty({ message: "apiPath không được để trống" })
    apiPath: string;

    @IsNotEmpty({ message: "Vui lòng nhập method" })
    method: string;

    @IsNotEmpty({ message: "Vui lòng module" })
    module: string;


}

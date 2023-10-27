import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator'
import mongoose from 'mongoose';
export class CreateResumeDto {

    @IsNotEmpty({ message: "Vui lòng nhập Email" })
    email: string;

    @IsNotEmpty({ message: "userId không được để trống" })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "Vui lòng nhập URL" })
    url: string;

    @IsNotEmpty({ message: "Vui lòng nhập status" })
    status: string;

    @IsNotEmpty({ message: "companyId không được để trống" })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "jobId không được để trống" })
    jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
    @IsNotEmpty({ message: 'url không được để trống' })
    url: string;

    @IsNotEmpty({ message: 'companyId không được để trống' })
    @IsMongoId({ message: 'companyId phải thuộc kiểu mongo id' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId không được để trống' })
    @IsMongoId({ message: 'jobId phải thuộc kiểu mongo id' })
    jobId: mongoose.Schema.Types.ObjectId;
}


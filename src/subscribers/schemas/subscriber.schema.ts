import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Permission } from "src/permissions/schemas/permission.schema";

export type SubcriberDocument = HydratedDocument<Subcriber>;

@Schema({ timestamps: true })
export class Subcriber {
    @Prop({ required: true })
    email: string

    @Prop()
    name: string

    @Prop()
    skills: string[]

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string,
    };
    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string,
    };
    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string,
    };

    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;

}

export const SubcriberSchema = SchemaFactory.createForClass(Subcriber);





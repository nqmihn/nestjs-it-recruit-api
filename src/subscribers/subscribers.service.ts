import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subcriber, SubcriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(@InjectModel(Subcriber.name) private subcriberModel: SoftDeleteModel<SubcriberDocument>) { }
  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { email, name, skills } = createSubscriberDto
    const isExist = await this.subcriberModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại`)
    }
    let subcriber = await this.subcriberModel.create({
      email, name, skills,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: subcriber?._id,
      createdAt: subcriber?.createdAt
    }
  }
  async getSkills(user: IUser) {
    const { email } = user
    return await this.subcriberModel.findOne({ email }, { skills: 1 })
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * (+limit);
    let defaultLimit = limit ? +limit : 10;
    const totalItems = (await this.subcriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.subcriberModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('cant not find subcriber');
    }
    return await this.subcriberModel.findOne({ _id: id })
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {


    return await this.subcriberModel.updateOne({ email: user.email }, {
      ...updateSubscriberDto, updatedBy: {
        _id: user._id,
        email: user.email
      }
    }, { upsert: true })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`can not find subcriber with id=${id}`)

    await this.subcriberModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return this.subcriberModel.softDelete({ _id: id })
  }
}

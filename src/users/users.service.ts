import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose/dist/soft-delete-model';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>
  ) { }
  getHashPassword = (password: string) => {

    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }
  async create(createUserDto: CreateUserDto, user: IUser) {
    const { email, password, name, age, gender, address, role, company } = createUserDto
    const isExist = await this.userModel.findOne({ email })
    if (isExist) {
      throw new BadRequestException('Email đã được sử dụng')
    }

    const hashPassword = this.getHashPassword(password)
    let newUser = await this.userModel.create({
      email: email,
      password: hashPassword,
      name: name,
      age: age,
      gender: gender,
      address: address,
      role: role,
      company: company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return newUser;

  }
  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password, age, gender, address } = registerUserDto
    const isExist = await this.userModel.findOne({ email })
    if (isExist) {
      throw new BadRequestException('Email đã được sử dụng')
    }
    const userRole = await this.roleModel.findOne({ name: USER_ROLE })
    return await this.userModel.create({
      name: name,
      email: email,
      password: this.getHashPassword(password),
      age: age,
      gender: gender,
      address: address,
      role: userRole?._id,
    })


  }



  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * (+limit);
    const defaultLimit = limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit)
    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select('-password')
      .exec();
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Cant Find User!!';
    return await this.userModel.findOne({ _id: id })
      .select("-password")
      .populate({
        path: "role",
        select: { name: 1, _id: 1 }
      });

  }
  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username }).populate({ path: "role", select: { name: 1 } });
  }
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)

  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, {
      ...updateUserDto, updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Cant Find User!!';
    const foundUser = await this.userModel.findById(id);
    if (foundUser && foundUser.email === "abc1@gmail.com")
      throw new BadRequestException("Không thể xóa tài khoản Admin")
    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })

    return this.userModel.softDelete({ _id: id });
  }
  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id: _id }, {
      refreshToken
    })
  }
  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken }).populate({
      path: "role",
      select: { name: 1 }
    })
  }


}

import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @ResponseMessage('Create new subcriber')
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }
  @Post("skills")
  @ResponseMessage("Get subsciber's skills")
  @SkipCheckPermission()
  getUserSkills(@User() user:IUser){
    return this.subscribersService.getSkills(user)
  }

  @Get()
  @ResponseMessage("Fetch subcriber by paginate")
  findAll(@Query("current") currentPage: string, @Query("pageSize") limit: string, @Query() qs: string) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Find subcriber by id")
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage("Update subcriber")
  update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete subcriber')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id,user);
  }
}

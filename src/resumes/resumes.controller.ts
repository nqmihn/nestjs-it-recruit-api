import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Get()
  @ResponseMessage("Fetch all resumes with paginate")
  findAll(@Query("current") currentPage: string, @Query("pageSize") limit: string, @Query() qs: string) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Post('/by-user')
  @ResponseMessage("Get Resumes by User")
  getCvByUser(@User() user: IUser) {
    return this.resumesService.getByUser(user);
  }

  @Patch(':id')
  @ResponseMessage('Update status resume')
  update(@Param('id') id: string, @Body('status') status: string, @User() user: IUser) {
    return this.resumesService.update(id, status, user);
  }
  @Delete(':id')
  @ResponseMessage("Delete a resume by id")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}
  async create(createUnitDto: CreateUnitDto, userId) {
    const unit = await this.prisma.unit.create({
      data: {
        title: createUnitDto.title,
        description: createUnitDto.description,
        addedBy: userId,
        courseId: createUnitDto.courseId,
      },
    });
    return unit;
  }

  async findAll(courseId: number) {
    const Units = await this.prisma.unit.findMany({
      where: {
        courseId: courseId,
      },
    });
    return Units;
  }

  async findOne(id: number) {
    const unit = await this.prisma.unit.findFirst({ where: { id: id } });
    return unit;
  }

  async update(id: number, updateUnitDto: UpdateUnitDto, courseId: number) {
    const unit = await this.prisma.unit.update({
      where: {
        id: id,
        courseId: courseId,
      },
      data: {
        ...updateUnitDto,
      },
    });
    return unit;
  }

  async remove(id: number, courseId: number) {
    const unit = await this.prisma.unit.delete({
      where: {
        id: id,
        courseId: courseId,
      },
    });
    return unit;
  }
}

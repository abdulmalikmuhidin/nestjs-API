import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './users.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async createUser(dto: CreateUserDto) {
        return this.userModel.create(dto);
    }

    async getUsers() {
        return this.userModel.find().exec();
    }

    async getUser(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.userModel.findById(id).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
    async updateUser(id: string, dto: UpdateUserDto) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.userModel
            .findByIdAndUpdate(id, dto, {
                new: true,
                runValidators: true,
            })
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async deleteUser(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.userModel.findByIdAndDelete(id).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return { message: 'User deleted successfully' };
    }
}
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Founder, FounderDocument } from './entities/founder.entity';
import { CreateFounderDto } from './dto/create-founder.dto';
import * as bcrypt from 'bcryptjs';
import { FounderResponse } from './types/founder-response';

@Injectable()
export class FounderService {
  constructor(
    @InjectModel(Founder.name) private founderModel: Model<FounderDocument>,
  ) {}
  async signup(createFounderDto: CreateFounderDto): Promise<FounderResponse> {
    const { name, email, password } = createFounderDto;

    //Check for existing user
    const existingEmail = await this.founderModel.findOne({ email});
    if (existingEmail) {
      throw new ConflictException('Email is already in use');
    }

    //Check for existing name
    const existingName = await this.founderModel.findOne({ name });
    if (existingName) {
      throw new ConflictException('Name is already in use');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create founder
    const founder = await this.founderModel.create({
      name, 
      email, 
      password: hashedPassword
    });

    //return saved founder
    return {
      id: founder._id.toString(),
      name: founder.name,
      email:founder.email,
      createdAt: founder.createdAt,
    }
  }
}

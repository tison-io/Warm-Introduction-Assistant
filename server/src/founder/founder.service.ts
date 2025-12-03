import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Founder, FounderDocument } from './entities/founder.entity';
import { CreateFounderDto } from './dto/create-founder.dto';
import * as bcrypt from 'bcrypt';
import { FounderResponse } from './types/founder-response';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class FounderService {
  constructor(
    @InjectModel(Founder.name) private founderModel: Model<FounderDocument>,
    private configService: ConfigService,
    private jwtService: JwtService
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
      
    const user = await this.founderModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
      
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT configuration error');
    }
  
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecret,
      { expiresIn: '24h' }
    );
  
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }
  
  async getUserProfile(userId: string) {
    const user = await this.founderModel.findById(userId).select('-password');

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;       
  }
}

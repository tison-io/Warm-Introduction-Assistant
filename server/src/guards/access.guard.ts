import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Founder, FounderDocument } from 'src/founder/entities/founder.entity';

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(
        @InjectModel(Founder.name) private founderModel: Model<FounderDocument>
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) return false;

        const founder = await this.founderModel.findById(user.userId);
        if (!founder) return false;

        //Check lifetime access
        if (founder.tier === 'lifetime') {
            return true;
        }

        //Check Trial Expiry
        const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days free trial
        const expiryDate = new Date(founder.trialStartDate.getTime() + TRIAL_DURATION_MS);
        const now = new Date();

        if (now > expiryDate) {
            throw new ForbiddenException({
                message: 'Trial expired',
                errorCode: 'PAYMENT_REQUIRED',
            });
        }

        return true;
    }
}
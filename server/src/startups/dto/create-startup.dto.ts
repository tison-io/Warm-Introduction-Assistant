import { IsString, IsArray, MinLength, MaxLength, IsUrl, IsMongoId, ArrayMinSize, ArrayMaxSize, IsIn } from 'class-validator';

export const VALID_TAGS = [
   'SaaS', 'Fintech', 'AI/ML', 'Healthtech', 'Edtech', 'E-commerce', 'Blockchain', 'B2B', 'B2C', 'Agritech', 'Cybersecurity', 'Web3'
]

export class CreateStartupDto {
    @IsString()
    @MinLength(2, { message: 'Startup name is too short' })
    name:string;

    @IsString()
    founderName: string;

    @IsString()
    founderEmail: string;

    @IsString()
    @MinLength(50, {
        message: 'Blurb is too short.'
    })
    @MaxLength(500, {
        message: 'Blurb is too long. Keep it concise'
    })
    blurb: string;

    @IsUrl({}, { message: 'Pitch deck must be a valid url.' })
    pitchLink:string;

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(2, { message: 'Select at least 2 tags'})
    @ArrayMaxSize(5, { message: 'You can select a maximum of 5 tags' })
    @IsIn(VALID_TAGS, { 
        each: true, 
        message: (args) => `Invalid tag: ${args.value}. Choose from: ${VALID_TAGS.join(', ')}` 
    })
    tags: string[];

    @IsMongoId({ message: 'Invalid Id' })
    founderId: string;
}

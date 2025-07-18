import { ArrayNotEmpty, IsArray, IsInt, IsString } from "class-validator";

export class CreateAdminDto {
    
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    email: string;

    @IsString()
    phone: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({each: true})
    permissionIds: number[];    
}
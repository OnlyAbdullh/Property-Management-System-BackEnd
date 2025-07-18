import { IsNumber, IsString } from "class-validator";

export class UploadPropertyReservationDto {
    @IsNumber()
    propertyId: number;

    @IsString()
    phone: string;
}
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { Request } from "express";
import { DeletePropertyImageUseCase } from "src/application/use-cases/property/delete-property-image.use-case";
import { GetPropertyImagesUseCase } from "src/application/use-cases/property/get-property-images.use-case";
import { UpdatePropertyImageUseCase } from "src/application/use-cases/property/update-property-image.use-case";
import { UploadPropertyImagesUseCase } from "src/application/use-cases/property/upload-property-image.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { Roles } from "src/shared/decorators/role.decorator";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { successResponse } from "src/shared/helpers/response.helper";
import { PropertyImageInterceptor, PropertyImagesInterceptor } from "src/shared/interceptors/file-upload.interceptor";
import { UploadPropertyImagesSwaggerDoc } from "../swagger/property-image/upload-property-images.swagger";
import { GetPropertyImagesSwaggerDoc } from "../swagger/property-image/get-property-images.swagger";
import { UpdatePropertyImageSwaggerDoc } from "../swagger/property-image/update-property-image.swagger";
import { DeletePropertyImageSwaggerDoc } from "../swagger/property-image/delete-property-image.swagger";


@Controller('property-image')
export class PropertyImageController {

    constructor(
        private readonly uploadPropertyImageUseCase: UploadPropertyImagesUseCase,
        private readonly getPropertyImagesUseCase: GetPropertyImagesUseCase,
        private readonly updatePropertyImageUseCase: UpdatePropertyImageUseCase,
        private readonly deletePropertyImageUseCase: DeletePropertyImageUseCase,
    ){}


    @Roles('صاحب مكتب')
    @Post(':propertyId/images')
    @UploadPropertyImagesSwaggerDoc()
    @HttpCode(HttpStatus.CREATED)
    @PropertyImagesInterceptor()
    async uploadImages(
        @Param('propertyId',ParseIntPipe) propertyId: number,
        @CurrentUser() user,
        @UploadedFiles() files: Express.Multer.File[],
    ){
        const userId = user.sub;
        const images =  this.uploadPropertyImageUseCase.execute(propertyId,userId,files);
        return successResponse([],'تم حفظ صور العقار بنجاح',201)
    }

    @Get(':propertyId/images')
    @GetPropertyImagesSwaggerDoc()
    @HttpCode(HttpStatus.OK)
    async getImages(
        @Param('propertyId', ParseIntPipe) propertyId: number,
        @Req() request: Request,
    ) {
        const baseUrl = `${request.protocol}://${request.get('host')}`;
        const images =  await this.getPropertyImagesUseCase.execute(propertyId,baseUrl);
        return successResponse(images,'تم ارجاع صور العقار بنجاح',200);
    }

    @Roles('صاحب مكتب')
    @Put(':propertyId/images/:imageId')
    @HttpCode(HttpStatus.OK)
    @UpdatePropertyImageSwaggerDoc()
    @PropertyImageInterceptor()
    async updateImge(
        @Param('propertyId',ParseIntPipe) propertyId: number,
        @Param('imageId',ParseIntPipe) imageId: number,
        @CurrentUser() user,
        @UploadedFile() file: Express.Multer.File
    ){
        const userId = user.sub;
        const result = await this.updatePropertyImageUseCase.execute(propertyId,userId,imageId,file);
        return successResponse([],'تم تعديل صورة العقار بنجاح',200);
    }

    @Roles('صاحب مكتب')
    @Delete(':propertyId/images/:imageId')
    @DeletePropertyImageSwaggerDoc()
    @HttpCode(HttpStatus.OK)
    async deleteImage(
        @Param('propertyId',ParseIntPipe) propertyId: number,
        @Param('imageId',ParseIntPipe) imageId: number,
        @CurrentUser() user,
    )
    {
        const userId = user.sub;
        const result =await  this.deletePropertyImageUseCase.execute(propertyId,userId,imageId);
        return successResponse([],'تم حذف صورة العقار بنجاح',200);
    }
}
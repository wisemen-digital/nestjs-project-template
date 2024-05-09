import { Body, Controller, Delete, HttpCode, Param, ParseUUIDPipe, Post, Req, Res } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Request } from '../../auth/guards/auth.guard.js'
import { CreateFileDto } from '../dtos/create-file.dto.js'
import { type CreateFileResponse, CreateFileResponseDoc, CreateFileResponseTransformer } from '../transformers/file-created.transformer.js'
import { FileService } from '../services/file.service.js'

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor (
    private readonly fileService: FileService
  ) {}

  @Post()
  @CreateFileResponseDoc()
  async createFile (
    @Req() req: Request,
    @Body() createFileDto: CreateFileDto
  ): Promise<CreateFileResponse> {
    const { file, uploadUrl } = await this.fileService.create(createFileDto, req.auth.user.uuid)

    return new CreateFileResponseTransformer().item(file, uploadUrl)
  }

  @Post(':file/confirm-upload')
  @ApiResponse({
    status: 200,
    description: 'Successfully confirmed file upload'
  })
  @HttpCode(200)
  async confirmFileUpload (
    @Param('file', ParseUUIDPipe) fileUuid: string
  ): Promise<void> {
    await this.fileService.confirmUploadOrFail(fileUuid)
  }

  @Post(':file/download')
  @ApiResponse({
    status: 302,
    description: 'Successfully downloaded file'
  })
  @HttpCode(302)
  async downloadFile (
    @Param('file', ParseUUIDPipe) fileUuid: string,
    @Res() res: Response
  ): Promise<void> {
    const file = await this.fileService.findOneOrFail({ uuid: fileUuid })

    res.setHeader('Location', await this.fileService.getTemporarilyUrl(file))
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`)
    res.setHeader('Content-Type', file.mimeType ?? 'application/octet-stream')
    res.redirect(await this.fileService.getTemporarilyUrl(file))
  }

  @Delete(':file')
  @ApiResponse({
    status: 200,
    description: 'Successfully removed file'
  })
  async removeFile (
    @Param('file', ParseUUIDPipe) fileUuid: string
  ): Promise<void> {
    await this.fileService.remove(fileUuid)
  }
}

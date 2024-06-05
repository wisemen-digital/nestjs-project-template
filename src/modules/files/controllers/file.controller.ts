import { Body, Controller, Delete, HttpCode, Param, ParseUUIDPipe, Post, Req, Res } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Request } from '../../auth/guards/auth.guard.js'
import { CreateFileDto } from '../dtos/create-file.dto.js'
import { type CreateFileResponseTransformerType, CreateFileResponseTransformer } from '../transformers/file-created.transformer.js'
import { FileFlowService } from '../services/file.flows.service.js'
import { confirmFileUploadResponse, createFileResponse, downloadFileResponse, removeFileResponse } from '../docs/file-response.docs.js'

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor (
    private readonly fileFlowService: FileFlowService
  ) {}

  @Post()
  @ApiResponse(createFileResponse)
  async createFile (
    @Req() req: Request,
    @Body() createFileDto: CreateFileDto
  ): Promise<CreateFileResponseTransformerType> {
    const userUuid = req.auth.user.uuid
    const { file, uploadUrl } = await this.fileFlowService.create(createFileDto, userUuid)
    return new CreateFileResponseTransformer().item(file, uploadUrl)
  }

  @Post('/:file/confirm-upload')
  @ApiResponse(confirmFileUploadResponse)
  @HttpCode(200)
  async confirmFileUpload (
    @Param('file', ParseUUIDPipe) fileUuid: string
  ): Promise<void> {
    await this.fileFlowService.confirmUploadOrFail(fileUuid)
  }

  @Post('/:file/download')
  @ApiResponse(downloadFileResponse)
  @HttpCode(302)
  async downloadFile (
    @Param('file', ParseUUIDPipe) fileUuid: string,
    @Res() res: Response
  ): Promise<void> {
    const { file, temporaryUrl } = await this.fileFlowService.getTemporaryUrl(fileUuid)

    res.setHeader('Location', temporaryUrl)
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`)
    res.setHeader('Content-Type', file.mimeType ?? 'application/octet-stream')
    res.redirect(temporaryUrl)
  }

  @Delete('/:file')
  @ApiResponse(removeFileResponse)
  async removeFile (
    @Param('file', ParseUUIDPipe) fileUuid: string
  ): Promise<void> {
    await this.fileFlowService.remove(fileUuid)
  }
}

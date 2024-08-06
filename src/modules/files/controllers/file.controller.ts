import { Body, Controller, Delete, HttpCode, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { CreateFileDto } from '../dtos/create-file.dto.js'
import { type CreateFileResponse, CreateFileResponseTransformer } from '../transformers/file-created.transformer.js'
import { FileFlowService } from '../services/file.flows.service.js'
import { confirmFileUploadApiResponse, createFileApiResponse, downloadFileApiResponse, removeFileApiResponse } from '../docs/file-response.docs.js'
import { getAuthOrFail } from '../../auth/middleware/auth.middleware.js'

@ApiTags('File')
@Controller('file')
@ApiOAuth2([])
export class FileController {
  constructor (
    private readonly fileFlowService: FileFlowService
  ) {}

  @Post()
  @ApiResponse(createFileApiResponse)
  async createFile (
    @Body() createFileDto: CreateFileDto
  ): Promise<CreateFileResponse> {
    const userUuid = getAuthOrFail().uid
    const { file, uploadUrl } = await this.fileFlowService.create(createFileDto, userUuid)
    return new CreateFileResponseTransformer().item(file, uploadUrl)
  }

  @Post('/:file/confirm-upload')
  @ApiResponse(confirmFileUploadApiResponse)
  @HttpCode(200)
  async confirmFileUpload (
    @Param('file', ParseUUIDPipe) fileUuid: string
  ): Promise<void> {
    await this.fileFlowService.confirmUploadOrFail(fileUuid)
  }

  @Post('/:file/download')
  @ApiResponse(downloadFileApiResponse)
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
  @ApiResponse(removeFileApiResponse)
  async removeFile (
    @Param('file', ParseUUIDPipe) fileUuid: string
  ): Promise<void> {
    await this.fileFlowService.remove(fileUuid)
  }
}

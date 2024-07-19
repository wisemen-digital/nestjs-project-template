import { Body, Controller, Delete, HttpCode, Param, ParseUUIDPipe, Post, Req, Res } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Request } from '../../auth/guards/auth.guard.js'
import { CreateFileDto } from '../dtos/create-file.dto.js'
import { type CreateFileResponse, CreateFileResponseTransformer } from '../transformers/file-created.transformer.js'
import { FileFlowService } from '../services/file.flows.service.js'
import { confirmFileUploadResponse, createFileResponse, downloadFileResponse, removeFileResponse } from '../docs/file-response.docs.js'

@ApiTags('Files')
@Controller('files')
@ApiBearerAuth()
export class FileController {
  constructor (
    private readonly fileFlowService: FileFlowService
  ) {}

  @Post('/')
  @ApiResponse(createFileResponse)
  public async createFile (
    @Req() req: Request,
    @Body() createFileDto: CreateFileDto
  ): Promise<CreateFileResponse> {
    const userUuid = req.auth.user.uuid
    const { file, uploadUrl } = await this.fileFlowService.create(createFileDto, userUuid)
    return new CreateFileResponseTransformer().item(file, uploadUrl)
  }

  @Post('/:fileUuid/confirm-upload')
  @ApiResponse(confirmFileUploadResponse)
  @HttpCode(200)
  public async confirmFileUpload (
    @Param('fileUuid', ParseUUIDPipe) fileUuid: string
  ): Promise<void> {
    await this.fileFlowService.confirmUploadOrFail(fileUuid)
  }

  @Post('/:fileUuid/download')
  @ApiResponse(downloadFileResponse)
  @HttpCode(302)
  public async downloadFile (
    @Param('fileUuid', ParseUUIDPipe) fileUuid: string,
    @Res() res: Response
  ): Promise<void> {
    const { file, temporaryUrl } = await this.fileFlowService.getTemporaryUrl(fileUuid)

    res.setHeader('Location', temporaryUrl)
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`)
    res.setHeader('Content-Type', file.mimeType ?? 'application/octet-stream')
    res.redirect(temporaryUrl)
  }

  @Delete('/:fileUuid')
  @ApiResponse(removeFileResponse)
  public async removeFile (
    @Param('fileUuid', ParseUUIDPipe) fileUuid: string
  ): Promise<void> {
    await this.fileFlowService.remove(fileUuid)
  }
}

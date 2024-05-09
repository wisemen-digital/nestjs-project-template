// /* eslint-disable @typescript-eslint/ban-types */
// import { JobService, createJob } from '@apricote/nest-pg-boss'
// import { Injectable } from '@nestjs/common'
// import { Job } from 'pg-boss'
// import { IsNull, LessThan } from 'typeorm'
// import { Cron } from '@nestjs/schedule'
// import { FileRepository } from '../repositories/file.repository.js'

// interface RemoveUnusedFileJobData {
//   minAgeInMinutes: number
// }

// export const RemoveUnusedFileJob = createJob<RemoveUnusedFileJobData>('remove-unused-file')

// @Injectable()
// export class RemoveUnusedFileJobHandler {
//   constructor (
//     private readonly fileRepository: FileRepository
//   ) {}

//   @RemoveUnusedFileJob.Handle()
//   async handleJob (job: Job<RemoveUnusedFileJobData>): Promise<void> {
//     const file = await this.fileRepository.find({
//       relations: {
//         fileEntities: true
//       },
//       where: {
//         createdAt: LessThan(moment().subtract(job.data.minAgeInMinutes, 'minutes').toDate()),
//         fileEntities: {
//           uuid: IsNull()
//         }
//       }
//     })

//     await this.fileRepository.remove(file)
//   }
// }

// @Injectable()
// export class RemoveUnusedFileCron {
//   constructor (
//     @RemoveUnusedFileJob.Inject()
//     private readonly removeUnusedFileJobService: JobService<{}>
//   ) {}

//   @Cron('0 0 1 * * *') // Every day at 01:00
//   async handleCron (): Promise<void> {
//     await this.removeUnusedFileJobService.send({ minAgeInMinutes: 30 }, {})
//   }
// }

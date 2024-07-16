import type { FindManyOptions, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'
import { captureException } from '@sentry/node'

type ReturnType<T> = T[] | null

export enum ProcessorType {
  REPOSITORY = 'repository',
  QUERY_BUILDER = 'query-builder'
}

interface Processor<T extends ObjectLiteral> {
  size?: number
  handler: (queryResult: ReturnType<T>) => Promise<void>
}

export interface RepositoryProcessorOptions<T extends ObjectLiteral> extends Processor<T> {
  type: ProcessorType.REPOSITORY
  repository: Repository<T>
  find: Omit<FindManyOptions<T>, 'skip' | 'take'>
}

interface QueryBuilderProcessorOptions<T extends ObjectLiteral> extends Processor<T> {
  type: ProcessorType.QUERY_BUILDER
  query: SelectQueryBuilder<T>
}

export async function processBatches<T extends ObjectLiteral> (
  options: RepositoryProcessorOptions<T> | QueryBuilderProcessorOptions<T>
): Promise<void> {
  let skip = 0
  const take = options.size ?? 500

  while (true) {
    let batch: T[] = []

    if (options.type === ProcessorType.REPOSITORY) {
      batch = await options.repository.find({ skip, take, ...options.find })
    } else {
      batch = await options.query.skip(skip).take(take).getMany()
    }

    if (batch.length === 0) break

    try {
      await options.handler(batch)
    } catch (error) {
      captureException(error)
    }

    skip += take
  }
}

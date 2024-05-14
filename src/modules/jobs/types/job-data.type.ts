export interface JobData {
  classData: {
    retries: number
    priority: number
    createdAt: number
    queueName: string
    customerUuid: string
  }
  className: string
}

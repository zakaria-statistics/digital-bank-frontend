export interface AccountDetails {
  id: string
  balance: number
  currentPage: number
  pageSize: number
  type:string
  totalPages: number
  accountOperationDTOS: AccountOperation[]
}

export interface AccountOperation {
  id: number
  operationDate: string
  amount: number
  type: string
  description: string
}

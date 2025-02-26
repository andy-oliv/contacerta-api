interface Transaction {
  type: string;
  description: string;
  value: number;
  repeat?: boolean;
  repetitionNumber?: number;
  repeatInterval?: string;
  date: Date;
  observations?: string;
  attachmentUrl?: string;
  userId: string;
  categoryId?: number;
  creditCardId?: number;
  accountId?: number;
}

export default Transaction;

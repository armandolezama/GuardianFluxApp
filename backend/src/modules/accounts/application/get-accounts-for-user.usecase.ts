import { AccountRepository } from '../domain/account.repository';

interface GetAccountsForUserInput {
  userId: string;
}

interface GetAccountsForUserOutput {
  accounts: any[]; // puedes tipar con Account si quieres exponer todo
}

export class GetAccountsForUserUseCase {
  constructor(private readonly accountRepo: AccountRepository) {}

  async execute(input: GetAccountsForUserInput): Promise<GetAccountsForUserOutput> {

    const accounts = await this.accountRepo.findByUserId(input.userId);

    return { accounts };
  }
}

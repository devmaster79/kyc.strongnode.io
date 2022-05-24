import { InvestorDetail as InvestorDetailRepository } from 'app/models/investordetails.model'
import { User, User as UserRepository } from 'app/models/user.model'
import { GetInvestorDetails } from 'shared/endpoints/user'

type CreateResult = 'success' | 'investor-is-already-registered-error'

export class InvestorDetailService {
  constructor(
    private __investorDetailRepository: typeof InvestorDetailRepository,
    private __userRepository: typeof UserRepository
  ) {}

  async create(
    detail: GetInvestorDetails.InvestorDetail
  ): Promise<CreateResult> {
    // data for investor creating
    const user = await this.__getUser(detail.investor_email)
    const data = {
      user_id: user.id,
      reviewed: false,
      investor_name: detail.investor_name,
      investor_telegram_id: detail.investor_telegram_id,
      investor_country: detail.investor_country,
      investor_commitment_amount: detail.investor_commitment_amount,
      investor_wallet_address: detail.investor_wallet_address,
      investor_email: detail.investor_email,
      investor_fund_name: detail.investor_fund_name,
      investor_fund_website: detail.investor_fund_website
    }

    if (await this.__getInvestorDetail(user.id)) {
      return 'investor-is-already-registered-error'
    }

    const investorCreated = await this.__investorDetailRepository.create(data)
    if (investorCreated) {
      return 'success'
    }

    throw new Error('Error while inserting a new investor')
  }

  async get(email: string) {
    const user = await this.__getUser(email)
    return this.__getInvestorDetail(user.id, true)
  }

  private async __getUser(email: string): Promise<User> {
    const user = await this.__userRepository.findOne({
      where: { email: email }
    })

    if (!user) {
      throw new Error(`Could not find user with the email: ${email}`)
    }

    return user
  }

  private async __getInvestorDetail(user_id: number, reviewed?: boolean) {
    return await this.__investorDetailRepository.findOne({
      where: {
        user_id,
        ...(reviewed !== undefined ? { reviewed } : {})
      }
    })
  }
}

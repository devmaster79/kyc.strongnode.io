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
    const user = await this.__getUser(detail.investorEmail)
    const data = {
      userId: user.id,
      reviewed: false,
      investorName: detail.investorName,
      investorTelegramId: detail.investorTelegramId,
      investorCountry: detail.investorCountry,
      investorCommitmentAmount: detail.investorCommitmentAmount,
      investorWalletAddress: detail.investorWalletAddress,
      investorEmail: detail.investorEmail,
      investorFundName: detail.investorFundName,
      investorFundWebsite: detail.investorFundWebsite
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

  private async __getInvestorDetail(userId: number, reviewed?: boolean) {
    return await this.__investorDetailRepository.findOne({
      where: {
        userId,
        ...(reviewed !== undefined ? { reviewed } : {})
      }
    })
  }
}

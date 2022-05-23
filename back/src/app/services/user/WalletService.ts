import { User } from 'app/models/user.model'
import { UserWallets } from 'app/models/userwallets.model'

export class WalletService {
  constructor(
    private __userRepository: typeof User,
    private __userWalletsRepository: typeof UserWallets
  ) {}

  async addOrUpdateWallet(email: string, wallet: string) {
    const user = await this.__getUser(email)
    const userWallets = await this.__userWalletsRepository.findAll({
      where: { user_id: user.id, wallet }
    })

    if (userWallets.length > 0) {
      await this.__userWalletsRepository.update(
        { wallet },
        { where: { user_id: user.id, wallet } }
      )
      return 'updated'
    } else {
      await this.__userWalletsRepository.create({
        wallet,
        user_id: user.id
      })
      return 'created'
    }
  }

  async getUserWallets(email: string) {
    const user = await this.__getUser(email)
    const userWallets = await this.__userWalletsRepository.findAll({
      where: { user_id: user.id }
    })
    const wallets = userWallets.map((wallet) => wallet.wallet)
    return { email, wallets }
  }

  private async __getUser(email: string) {
    const user = await this.__userRepository.findOne({
      where: { email: email }
    })
    if (user) return user
    throw new Error('Error getting the wallet data for user.')
  }
}

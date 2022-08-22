import { User } from 'app/models/user.model'
import { DashboardOrder } from 'app/models/dashboardorder.model'

export class DashboardService {
  constructor(
    private __userRepository: typeof User,
    private __dashboardOrderRepository: typeof DashboardOrder
  ) {}

  async addOrUpdateOrders(email: string, orders: string[]) {
    orders.forEach((order, index) => {
      this.addOrUpdateSingleOrder(email, order, index)
    })
    return 'success'
  }

  async addOrUpdateSingleOrder(
    email: string,
    dashboardItem: string,
    position: number
  ) {
    const user = await this.__getUser(email)
    const dashboardOrder = await this.__dashboardOrderRepository.findAll({
      where: { userId: user.id, dashboardItem: dashboardItem }
    })

    if (dashboardOrder.length > 0) {
      await this.__dashboardOrderRepository.update(
        { position },
        { where: { userId: user.id, dashboardItem: dashboardItem } }
      )
      return 'updated'
    } else {
      await this.__dashboardOrderRepository.create({
        dashboardItem,
        position,
        userId: user.id
      })
      return 'created'
    }
  }

  async getDashboardOrder(email: string) {
    const user = await this.__getUser(email)
    const order = await this.__dashboardOrderRepository.findAll({
      where: { userId: user.id }
    })

    return { order: order }
  }

  private async __getUser(email: string) {
    const user = await this.__userRepository.findOne({
      where: { email: email }
    })
    if (user) return user
    throw new Error('Error getting the dashboard data for user.')
  }
}

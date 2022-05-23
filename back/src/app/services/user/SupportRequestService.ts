import { EMAIL_CONFIG } from 'app/config/config'
import { SupportRequest } from 'app/models/supportrequest.model'
import { User } from 'app/models/user.model'
import { EmailService } from '../communication/EmailService'
import { SupportRequestTemplate } from '../communication/templates/SupportRequestTemplate'

interface ISupportRequestData {
  subject: string
  message: string
}

export class SupportRequestService {
  constructor(
    private __userRepository: typeof User,
    private __supportRequestRepository: typeof SupportRequest,
    private __emailService: EmailService
  ) {}

  async create(email: string, supportRequestData: ISupportRequestData) {
    const user = await this.__getUser(email)
    await this.__emailService.sendTemplate(
      EMAIL_CONFIG.supportTeamEmail,
      new SupportRequestTemplate(),
      {
        email: user.email,
        username: user.user_name,
        message: supportRequestData.message
      }
    )
    await this.__supportRequestRepository.create({
      user_id: user.id,
      subject: supportRequestData.subject,
      message: supportRequestData.message
    })
  }

  private async __getUser(email: string): Promise<User> {
    const user = await this.__userRepository.findOne({
      where: { email: email }
    })
    if (user) return user
    throw new Error(`Could not find user with the email: ${email}`)
  }
}

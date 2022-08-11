import {
  IDENTITY_PHOTO_FACE_KEY,
  IDENTITY_PHOTO_KEY,
  KycEntry,
  USER_WITH_IDENTITY_PHOTO_FACE_KEY,
  USER_WITH_IDENTITY_PHOTO_KEY
} from 'app/models/kycEntry.model'
import { User } from 'app/models/user.model'
import {
  VerificationRequest,
  VerificationSubject
} from 'shared/endpoints/kycAdmin'
import { EmailService } from '../communication/EmailService'
import { VerificationRequestTemplate } from '../communication/templates/VerificationRequestTemplate'
import { FileService } from '../FileService'

export class KycAdminService {
  constructor(
    private __kycEntryRepository: typeof KycEntry,
    private __userRepository: typeof User,
    private __fileService: FileService,
    private __emailService: EmailService
  ) {}

  async listVerificationRequests() {
    const requests = await this.__getRequests()

    return requests.map((request) => {
      return {
        id: request.id,
        subject: request.verificationSubject,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        username: request.user!.username,
        createdAt: request.createdAt.getTime()
      }
    })
  }

  async getVerificationRequests(
    requestId: number
  ): Promise<null | VerificationRequest> {
    const request = await this.__getRequest(requestId)

    if (!request) return null
    if (!request.user) throw new UserIsMissingFromTheRequestError()
    if (typeof request.user.birthday !== 'string')
      throw new Error('sequalize did not return string')

    return {
      id: request.id,
      subject: {
        aiResult: request.aiResult,
        name: VerificationSubject.Identity,
        firstName: request.user.firstName,
        lastName: request.user.lastName,
        birthday: new Date(request.user.birthday).getTime(),
        images: {
          idImage: (
            await this.__fileService.get(
              IDENTITY_PHOTO_KEY(request.userId, request.documentType)
            )
          ).toDataURI(),
          userWithIdImage: (
            await this.__fileService.get(
              USER_WITH_IDENTITY_PHOTO_KEY(request.userId, request.documentType)
            )
          ).toDataURI()
        }
      },
      username: request.user.username,
      createdAt: request.createdAt.getTime()
    }
  }

  async approve(requestId: number) {
    const request = await this.__getRequest(requestId)
    if (!request) throw new VerificationRequestDoesNotExistError()
    if (!request.user) throw new UserIsMissingFromTheRequestError()
    await this.__sendStatusEmail({
      user: request.user,
      subject: request.verificationSubject,
      approved: true
    })
    await this.__setVerificationStatus(request.userId, {
      status: 'VerifiedByAdmin'
    })
    await this.__deleteRequest(request)
  }

  async reject(requestId: number, reason: string) {
    const request = await this.__getRequest(requestId)
    if (!request) throw new VerificationRequestDoesNotExistError()
    if (!request.user) throw new UserIsMissingFromTheRequestError()
    await this.__sendStatusEmail({
      user: request.user,
      subject: request.verificationSubject,
      approved: false,
      reason
    })
    await this.__setVerificationStatus(request.userId, {
      status: 'Rejected',
      reason
    })
    await this.__deleteRequest(request)
  }

  private async __sendStatusEmail(params: {
    user: User
    subject: VerificationSubject
    approved: boolean
    reason?: string
  }) {
    await this.__emailService.sendTemplate(
      params.user.email,
      new VerificationRequestTemplate(),
      {
        username: params.user.username,
        subject: params.subject,
        approved: params.approved,
        reason: params.reason || ''
      }
    )
  }

  private async __getRequests() {
    return await this.__kycEntryRepository.findAll({
      include: {
        model: User,
        as: 'user'
      }
    })
  }

  private async __getRequest(requestId: number) {
    return await this.__kycEntryRepository.findOne({
      include: {
        model: User,
        as: 'user'
      },
      where: {
        id: requestId
      }
    })
  }

  private async __deleteRequest(request: KycEntry) {
    await this.__fileService.delete(
      IDENTITY_PHOTO_KEY(request.userId, request.documentType)
    )
    await this.__fileService.delete(
      IDENTITY_PHOTO_FACE_KEY(request.userId, request.documentType)
    )
    await this.__fileService.delete(
      USER_WITH_IDENTITY_PHOTO_KEY(request.userId, request.documentType)
    )
    await this.__fileService.delete(
      USER_WITH_IDENTITY_PHOTO_FACE_KEY(request.userId, request.documentType, 1)
    )
    await this.__fileService.delete(
      USER_WITH_IDENTITY_PHOTO_FACE_KEY(request.userId, request.documentType, 2)
    )
    await this.__kycEntryRepository.destroy({
      where: { id: request.id }
    })
  }

  private async __setVerificationStatus(
    userId: number,
    verified: User['identityVerified']
  ) {
    await this.__userRepository.update(
      {
        identityVerified: verified
      },
      {
        where: {
          id: userId
        }
      }
    )
  }
}

export class VerificationRequestDoesNotExistError extends Error {
  constructor() {
    super('Verification request does not exist')
  }
}

export class UserIsMissingFromTheRequestError extends Error {
  constructor() {
    super('User is missing from the request')
  }
}

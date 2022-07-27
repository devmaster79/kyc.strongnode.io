import { sanitizeText } from 'app/services/Sanitizer'
import { VerificationSubject } from 'shared/endpoints/kycAdmin'
import { Sendable, template } from './BaseTemplate'

export type VerificationRequestTemplateProps =
  | {
      subject: VerificationSubject
      username: string
      approved: true
    }
  | {
      subject: VerificationSubject
      username: string
      reason: string
      approved: false
    }

export class VerificationRequestTemplate
  implements Sendable<VerificationRequestTemplateProps>
{
  renderSubject(params: VerificationRequestTemplateProps): string {
    if (params.approved)
      return `Your ${sanitizeText(params.subject)} is verified!`
    return `We failed to verify your ${sanitizeText(params.subject)}!`
  }

  renderBody(params: VerificationRequestTemplateProps): string {
    return template({
      rawTitle: this.renderSubject(params),
      rawBody: /* html */ `
      <div class="content">
        <p><b>Dear ${sanitizeText(params.username)},</b></p>
        ${
          params.approved
            ? this.__renderApprovedText(params)
            : this.__renderRejectedText(params)
        }
      </div>`
    })
  }

  private __renderRejectedText(params: {
    subject: VerificationSubject
    reason: string
  }) {
    return /* html */ `
      <p>
        Your request for verifying your ${sanitizeText(params.subject)}
        has been <b>rejected</b> unfortunately.
      </p>
      <p>The issue we found:</p>
      <p>${params.reason}</p>
      <p>Please correct the issue, so we can accept your request. If you found it irrelevant, please submit it again.</p>
    `
  }

  private __renderApprovedText(params: {
    subject: VerificationSubject
    username: string
  }) {
    return /* html */ `
      <p>
        Your request for verifying your ${sanitizeText(params.subject)}
        has been <b>approved</b>.
      </p>
    `
  }
}

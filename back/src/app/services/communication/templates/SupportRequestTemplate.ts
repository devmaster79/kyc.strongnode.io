import { Sendable, template } from './BaseTemplate'

export interface SupportRequestTemplateParams {
  email: string
  username: string
  message: string
}

/**
 * Email for support team of SNE.
 */
export class SupportRequestTemplate
  implements Sendable<SupportRequestTemplateParams>
{
  renderSubject(params: SupportRequestTemplateParams): string {
    return `Support Request from user: ${params.username}`
  }

  renderBody(params: SupportRequestTemplateParams): string {
    return template({
      title: this.renderSubject(params),
      body: /* html */ `
      <div class="content">
        <p><b>Dear support team,</b></p>
        <p>A new user requested support.</p>
        <hr />

        <p>Message</p>
        <p>${params.message}</p>
        <hr />

        <p>Details</p>
        <p>
          Email: <b>${params.email}</b><br />
          Username: <b>${params.username}</b>
        </p>
      </div>`
    })
  }
}

import { template, Sendable } from './BaseTemplate'
import { sanitizeUrl } from 'app/services/Sanitizer'

export interface RegistrationTemplateParams {
  link: string
}

export class RegistrationTemplate
  implements Sendable<RegistrationTemplateParams>
{
  renderSubject(): string {
    return 'Please continue your registration'
  }

  renderBody({ link }: RegistrationTemplateParams) {
    return template({
      rawTitle: this.renderSubject(),
      rawBody: /* html */ `<table
        role="presentation"
        border="0"
        cellpadding="0"
        cellspacing="0"
      >
        <tr>
          <td>
            <p>Hello, We're so excited that you want to be part of StrongNode!</p>
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="btn btn-primary"
            >
              <tbody>
                <tr>
                  <td align="left">
                    <table
                      role="presentation"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <a href="${sanitizeUrl(link)}" target="_blank">
                              CONTINUE REGISTRATION
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              If you have problems visiting the button above just
              copy and paste the following link into your browser:
            </p>
            <a href="${sanitizeUrl(link)}" target="_blank">
              ${sanitizeUrl(link)}
            </a>
            <hr />
            <p class="small">If you have registered already, please try signing in with a different email because this email was not in our database.</p>
            <p class="small">In case this email was not requested by you, please do not do anything.</p>
          </td>
        </tr>
      </table>`
    })
  }
}

import { template, Sendable } from './BaseTemplate'

export interface SignInTemplateParams {
  link: string
  userName: string
}

export class SignInTemplate implements Sendable<SignInTemplateParams> {
  renderSubject(): string {
    return 'Activate your account'
  }

  renderBody({ link, userName }: SignInTemplateParams) {
    return template({
      title: this.renderSubject(),
      body: /* html */ `<table
        role="presentation"
        border="0"
        cellpadding="0"
        cellspacing="0"
      >
        <tr>
          <td>
            <p><b>Hello ${userName},</b></p>
            <p>It is good to see you again!</p>
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
                            <a href="${link}" target="_blank">
                              Sign In
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
            <a href="${link}" target="_blank">${link}</a>
            <hr />
            <p class="small">In case this email was not requested by you, please do not do anything.</p>
          </td>
        </tr>
      </table>`
    })
  }
}

export class Base64File {
  constructor(public mime: string, public content: string) {}

  static fromDataURI(dataURI: string) {
    const file = dataURI.split(';base64,')
    const mime = file[0].replace('data:', '')
    const content = file[1]
    return new Base64File(mime, content)
  }

  getBinaryBuffer() {
    return Buffer.from(this.content, 'base64')
  }

  toDataURI() {
    return `data:${this.mime};base64,${this.content}`
  }
}

import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import Icon, { IconProps } from '@ui/Icon/Icon'
import React, { useRef, useState } from 'react'
import { CustomTheme } from 'theme'

export interface FileSizeLimit {
  bytes: number
  onViolation: () => void
}
export interface FileExtensionLimit {
  /** e.g.: jpg, jpeg, png */
  allowed: string[]
  onViolation: () => void
}

export type UploadProps = {
  description: React.ReactNode
  // TODO: it seams this would be better to be an actual image
  // as icons are not for big colorful pictures
  icon: IconProps['name']
  onSelectFile: (file: File) => Promise<void>
  status: {
    type: 'error' | 'loading' | 'success'
    message: string
  } | null
  fileSizeLimit?: FileSizeLimit
  fileExtensionLimit?: FileExtensionLimit
}

export default function ImageUpload(props: UploadProps) {
  const inputFile = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState('')

  const onUploadButtonClick = () => {
    if (inputFile.current === null) return
    inputFile.current.click()
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const file = event.target.files[0]
    const image = URL.createObjectURL(file)
    setImage(image)

    // handle file size limit
    if (props.fileSizeLimit && file.size > props.fileSizeLimit.bytes) {
      return props.fileSizeLimit.onViolation()
    }

    // handle file extension limit
    if (props.fileExtensionLimit) {
      const extension = file.name.split('.').pop()?.toLowerCase()
      if (!extension) {
        return props.fileExtensionLimit.onViolation()
      }
      if (props.fileExtensionLimit.allowed.indexOf(extension) === -1) {
        return props.fileExtensionLimit.onViolation()
      }
    }

    props.onSelectFile(file).catch(console.error)
  }

  return (
    <UploadWrapper>
      {props.description}
      {image && props.status ? (
        <ImgContainer type={props.status.type}>
          <img src={image} />
        </ImgContainer>
      ) : (
        <Icon
          name={props.icon}
          color="#141245"
          width={354}
          height={196}
          viewBox="0 0 354 196"
        />
      )}
      {props.status && <Message>{props.status.message}</Message>}
      <Button color="white" variant="medium" onClick={onUploadButtonClick}>
        {image ? 'Upload new picture' : 'Upload picture'}
      </Button>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </UploadWrapper>
  )
}

const BreathingBorderAnimation = (theme: CustomTheme) =>
  keyframes({
    '0%': {
      borderColor: theme.palette.border.strong
    },
    '50%': {
      borderColor: theme.palette.border.light
    },
    '100%': {
      borderColor: theme.palette.border.strong
    }
  })

const ImgContainer = styled.div<{ type: 'error' | 'loading' | 'success' }>(
  (props) => {
    let statusStyle

    switch (props.type) {
      case 'error':
        statusStyle = css({
          border: `1px solid ${props.theme.palette.error.main}`
        })
        break
      case 'loading':
        statusStyle = css({
          border: `1px dashed ${props.theme.palette.border.light}`,
          animation: `${BreathingBorderAnimation(props.theme)} 1s infinite`
        })
        break
      case 'success':
        statusStyle = css({
          border: `1px solid ${props.theme.palette.border.light}`
        })
        break
    }

    return css(
      {
        img: {
          width: '354px',
          height: '196px',
          objectFit: 'cover',
          borderRadius: '8px'
        },
        marginBottom: '5px',
        padding: '5px',
        borderRadius: '13px'
      },
      statusStyle
    )
  }
)

const UploadWrapper = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontSize: '18px',

  p: {
    maxWidth: '450px',
    paddingBottom: '1em'
  },

  button: {
    marginTop: '32px'
  }
}))

const Message = styled.div({
  textAlign: 'center'
})

import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import Icon, { IconProps } from '@ui/Icon/Icon'
import React, { useRef, useState } from 'react'
import { CustomTheme } from 'theme'

export type UploadProps = {
  description: string
  icon: IconProps['name']
  onSelectFile: (file: File) => Promise<void>
  result: {
    status: 'error' | 'loading' | 'success'
    message: string
  } | null
}

export default function IdentityUpload(props: UploadProps) {
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
    props.onSelectFile(file).catch(console.error)
  }

  return (
    <UploadWrapper>
      <p>{props.description}</p>
      {image && props.result ? (
        <ImgContainer status={props.result.status}>
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
      {props.result && <Message>{props.result.message}</Message>}
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

const ImgContainer = styled.div<{ status: 'error' | 'loading' | 'success' }>(
  (props) => {
    let statusStyle

    switch (props.status) {
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
    paddingBottom: '40px'
  },

  button: {
    marginTop: '32px'
  }
}))

const Message = styled.div({
  textAlign: 'center'
})

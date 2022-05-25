import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import Icon, { IconProps } from '@ui/Icon/Icon'
import React, { useRef, useState } from 'react'

export type UploadProps = {
  description: string
  icon: IconProps['name']
  onSelectFile: (imagePath: string) => void
}

export default function IdentityUpload(props: UploadProps) {
  const inputFile = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState('')

  const onUploadButtonClick = () => {
    if (inputFile.current === null) return
    inputFile.current.click()
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    props.onSelectFile(event.target.value)
    const image = URL.createObjectURL(event.target.files[0])
    setImage(image)
  }

  return (
    <UploadWrapper>
      <p>{props.description}</p>
      {image ? (
        <img src={image || ''} />
      ) : (
        <Icon
          name={props.icon}
          color="#141245"
          width={354}
          height={196}
          viewBox="0 0 354 196"
        />
      )}
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
  },

  img: {
    width: '354px',
    height: '196px',
    objectFit: 'cover',
    border: `1px solid ${props.theme.palette.border.light}`,
    borderRadius: '8px'
  }
}))

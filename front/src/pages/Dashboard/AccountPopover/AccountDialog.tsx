import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import userService from 'services/userService'

type FormValues = {
  file?: File[]
}
type Props = {
  email: string
  getProfile(): void
  setClose(status: boolean): void
}

const AccountDialog: React.FC<Props> = ({ email, getProfile, setClose }) => {
  const { register, handleSubmit } = useForm()
  const [isError, setError] = useState(false)

  const onSubmit = async (data: FormValues) => {
    const file = data?.file ? data?.file[0] : null
    if (file) {
      if (file.type && file.type.indexOf('image') === -1) {
        setError(true)
        return
      }
      const formData = new FormData()
      formData.append('file', file)
      return userService
        .updateAvatar({ body: formData })
        .then((response) => {
          if (response.result === 'success') {
            getProfile()
            setClose(false)
          }
        })
        .done()
    }
  }

  return (
    <DialogOverlay>
      <DialogBox
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <Title id="alert-dialog-title">Upload Avatar Image</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            <div>
              <input
                type="file"
                accept="image/png, image/jpeg"
                {...register('file')}
              />
              {isError ? <ErrorLabel>File is not an image</ErrorLabel> : ''}
            </div>
          </Container>
          <Footer>
            <Button onClick={() => setClose(false)}>Close</Button>
            <Button type="submit">Save</Button>
          </Footer>
        </form>
      </DialogBox>
    </DialogOverlay>
  )
}

const DialogOverlay = styled.div({
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#141245bf',
  right: 0,
  bottom: 0,
  top: 0,
  left: 0,
  zIndex: '1300'
})

const DialogBox = styled.div({
  position: 'absolute',
  color: 'white',
  backgroundColor: '#212B36',
  left: '40vw',
  top: '40vh'
})

const Button = styled.button({
  background: 'transparent',
  color: 'white',
  boxShadow: 'none',
  border: 'none',
  fontSize: 14,
  padding: 10,
  cursor: 'pointer'
})

const Title = styled.h2({
  fontWeight: 700,
  fontSize: '1em',
  padding: '10px 20px'
})

const Container = styled.div({
  borderRadius: 4,
  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  position: 'relative',
  padding: 20,
  minWidth: 450
})

const Footer = styled.div({
  display: 'flex',
  margin: '10px 0px',
  justifyContent: 'flex-end'
})

const ErrorLabel = styled.label({
  margin: '16px 0px',
  color: 'red'
})

export default AccountDialog

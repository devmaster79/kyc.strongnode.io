import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import InputField, { StyledInputWrapper } from '@ui/Input/InputField'
import Modal from '@ui/Modal/Modal'
import { IAnim } from '@ui/utils/useAnimated'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import kycAdminService from 'services/kycAdminService'
import { GetVerificationRequest } from 'shared/endpoints/kycAdmin'

interface VerificationRequestProps {
  requestId: number
  anim: IAnim<number, null>
  onClose: () => void
  onUpdate: () => void
}

export default function VerificationRequest({
  requestId,
  anim,
  onClose,
  onUpdate
}: VerificationRequestProps) {
  const [rejectionReason, setRejectionReason] = useState(
    'The document was hard to read'
  )
  const [request, setRequest] =
    useState<GetVerificationRequest.VerificationRequest | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    kycAdminService
      .getVerificationRequest({
        params: {
          requestId: requestId.toString()
        }
      })
      .then((response) => {
        if (response.result === 'success') {
          setRequest(response.request)
        } else {
          enqueueSnackbar(response.message, {
            variant: 'error'
          })
        }
      })
      .done()
  }, [requestId, enqueueSnackbar])

  function approve() {
    kycAdminService
      .approveVerificationRequest({
        params: { requestId: requestId.toString() }
      })
      .thenEnqueueSnackbar(enqueueSnackbar)
      .then(onUpdate)
      .done()
  }
  function reject() {
    kycAdminService
      .rejectVerificationRequest({
        params: { requestId: requestId.toString() },
        body: { reason: rejectionReason }
      })
      .thenEnqueueSnackbar(enqueueSnackbar)
      .then(onUpdate)
      .done()
  }

  return (
    <>
      <Modal anim={anim} title="" onClose={onClose} scrollable>
        {request ? (
          <RequestContainer>
            <h2>Details</h2>
            <RequestRow>
              <RequestParameter>Id</RequestParameter>
              <RequestData>{request.id}</RequestData>
            </RequestRow>
            <RequestRow>
              <RequestParameter>Username</RequestParameter>
              <RequestData>{request.username}</RequestData>
            </RequestRow>
            <RequestRow>
              <RequestParameter>Subject</RequestParameter>
              <RequestData>{request.subject.name}</RequestData>
            </RequestRow>
            <RequestRow>
              <RequestParameter>Name</RequestParameter>
              <RequestData>
                {request.subject.firstName} {request.subject.lastName}
              </RequestData>
            </RequestRow>
            <RequestRow>
              <RequestParameter>Birth</RequestParameter>
              <RequestData>
                {__formatBirthday(request.subject.birthday)}
              </RequestData>
            </RequestRow>
            <h2>Uploaded images</h2>
            <RequestRow>
              <RequestParameter>The document</RequestParameter>
              <RequestData>
                <img src={request.subject.images.idImage} />
              </RequestData>
            </RequestRow>
            <RequestRow>
              <RequestParameter>The user with the document</RequestParameter>
              <RequestData>
                <img src={request.subject.images.userWithIdImage} />
              </RequestData>
            </RequestRow>
          </RequestContainer>
        ) : (
          <h2>Loading...</h2>
        )}

        <Actions>
          <Button type="button" onClick={approve}>
            Approve
          </Button>
          <RejectionGroup>
            <InputField
              inputProps={{
                value: rejectionReason,
                onChange: (event) => setRejectionReason(event.target.value)
              }}
            />
            <Button type="button" onClick={reject}>
              Reject with message
            </Button>
          </RejectionGroup>
        </Actions>
      </Modal>
    </>
  )
}

function __formatBirthday(val: number) {
  const year = new Date(val).getFullYear().toString()
  const month = (new Date(val).getMonth() + 1).toString().padStart(2, '0')
  const date = new Date(val).getDate().toString().padStart(2, '0')
  return `${year}-${month}-${date}`
}

const RequestContainer = styled.div((props) => ({
  color: props.theme.palette.text.primary,
  display: 'flex',
  flexFlow: 'column',
  margin: '0em 1em',
  gap: '0.5em',
  h2: {
    textAlign: 'left',
    margin: '1em'
  }
}))
const RequestRow = styled.div({
  display: 'flex',
  gap: '0.5em'
})
const RequestParameter = styled.div((props) => ({
  flex: 1,
  background: props.theme.palette.background.light,
  padding: '0.5em',
  borderRadius: 8
}))
const RequestData = styled.div({
  textAlign: 'left',
  flex: 5,
  borderRadius: 8,
  img: {
    borderRadius: 8
  }
})
const RejectionGroup = styled.div((props) => ({
  display: 'flex',
  [StyledInputWrapper.toString()]: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    height: '2em'
  },
  [Button.toString()]: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  }
}))

const Actions = styled.div({
  width: '100%',
  padding: '1em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'right',
  flexWrap: 'wrap',
  gap: '1em',
  [Button.toString()]: {
    height: '4em',
    margin: 0,
    borderRadius: 8
  },
  p: {
    padding: '1em'
  }
})
import styled from '@emotion/styled'
import Button from '@ui/Button/Button'
import { useAnimated } from '@ui/utils/useAnimated'
import TableSection from 'components/TableSection/TableSection'
import { useCallback, useEffect, useState } from 'react'
import kycAdminService from 'services/kycAdminService'
import { ListVerificationRequests } from 'shared/endpoints/kycAdmin'
import VerificationRequest from './VerificationRequest'

export function VerificationRequestAdmin() {
  const [requests, setRequests] = useState<
    ListVerificationRequests.ShortVerificationRequest[]
  >([])
  const [showRequestId, setShowRequestId] = useState<null | number>(null)
  const requestModalAnim = useAnimated<number, null>(showRequestId, 300)
  const fetchRequests = useCallback(() => {
    kycAdminService
      .listVerificationRequests()
      .then((response) => {
        if (response.result === 'success') {
          setRequests(response.requests)
        }
      })
      .done()
  }, [])
  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  function view(requestId: number, _subject: string) {
    setShowRequestId(requestId)
  }

  return (
    <Container>
      <StyledTableSection
        searchEnabled={false}
        title="Verification requests"
        subtitle=""
        overwrittenFields={{
          createdAt: (val: number) => {
            const year = new Date(val).getFullYear().toString()
            const month = (new Date(val).getMonth() + 1)
              .toString()
              .padStart(2, '0')
            const date = new Date(val).getDate().toString().padStart(2, '0')
            return `${year}-${month}-${date}`
          }
        }}
        dataSet={{
          items: requests.map((request) => ({
            ...request,
            actions: (
              <Button onClick={() => view(request.id, request.subject)}>
                View
              </Button>
            )
          }))
        }}
        columns={[
          {
            id: 'id',
            label: '#'
          },
          {
            id: 'username',
            label: 'Username'
          },
          {
            id: 'subject',
            label: 'Subject'
          },
          {
            id: 'createdAt',
            label: 'Created at'
          },
          {
            id: 'actions',
            label: 'Actions'
          }
        ]}
      />
      {requestModalAnim.state !== 'closed' && (
        <VerificationRequest
          anim={requestModalAnim}
          onClose={() => {
            setShowRequestId(null)
          }}
          onUpdate={() => {
            setShowRequestId(null)
            fetchRequests()
          }}
          requestId={requestModalAnim.storedValue}
        />
      )}
    </Container>
  )
}

const StyledTableSection = styled(TableSection)({
  marginTop: 0
})

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingTop: '95px',
  paddingBottom: '70px',
  gap: '32px',
  margin: 'auto'
})

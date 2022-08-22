import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useEffect, useCallback, useRef } from 'react'
import userService from '../services/userService'
import { Banner } from '../@ui/Banner/Banner'
import authService from 'services/auth'
import TableSection from 'components/TableSection/TableSection'
import { CoinMetrics } from '../@ui/Table/CoinMetrics'
import { CryptoWidget } from '../@ui/Crypto/CryptoWidget'
import * as DashboardStyle from '@ui/Dashboard/DashboardStyle'
import { useEthers } from '@usedapp/core'
import { LastTransactions } from '../@ui/Crypto/LastTransactions'
import { useState } from 'react'

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar()
  const { account } = useEthers()
  const navigate = useNavigate()

  const handleDashboard = useCallback(async () => {
    if (localStorage.getItem('visit') !== 'true') {
      enqueueSnackbar('Welcome to the StrongNodeID dashboard', {
        variant: 'success'
      })
      localStorage.setItem('visit', 'true')
    }
  }, [enqueueSnackbar])

  const dash = useRef()
  useEffect(() => {
    handleDashboard()
  }, [dash, handleDashboard])

  const signOut = useCallback(() => {
    authService.signOut()
    navigate('/verify-email')
  }, [navigate])

  const token = localStorage.getItem('token')
  const useremail = localStorage.getItem('email')

  useEffect(() => {
    async function fetch() {
      const dashboardOrder = await userService.getDashboardOrder()
      const orderList: string[] = []
      if (dashboardOrder.statusCode === 200) {
        dashboardOrder.order.map(
          (value) => (orderList[value.position] = value.dashboardItem)
        )
      }

      if (orderList.length > 0) {
        setList(orderList)
      } else {
        setList([
          'CryptoWidget',
          'CoinMetrics',
          'LastTransactions',
          'FarmingMetrics'
        ])
      }

      const userResult = await userService.getProfile()

      if (userResult.statusCode !== 200) {
        console.error('Cannot get the user object! Please, try to relogin.')
        signOut()
      }
    }

    fetch()
  }, [token, useremail, signOut])

  const [dragItem, setDragItem] = useState<number>(-1)
  const [dragOverItem, setDragOverItem] = useState<number>(-1)
  const [list, setList] = useState<string[]>([])

  const getComponent = (index: number) => {
    const name = list[index]
    switch (name) {
      case 'CryptoWidget':
        return <CryptoWidget />
      case 'CoinMetrics':
        return <CoinMetrics title="Coin metrics" />
      case 'LastTransactions':
        return <LastTransactions address={account ? account : ''} />
      case 'FarmingMetrics':
        return (
          <TableSection comingSoon title="Farming Metrics" subtitle="NFT 18" />
        )
      default:
        return
    }
  }

  const dragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    setDragItem(position)
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    setDragOverItem(position)
  }

  const drop = () => {
    const newOrder = [...list]
    const dragItemContent = newOrder[dragItem]
    newOrder.splice(dragItem, 1)
    newOrder.splice(dragOverItem, 0, dragItemContent)
    setDragItem(-1)
    setDragOverItem(-1)
    setList(newOrder)
    userService.addOrUpdateDashboardOrder({
      body: { order: newOrder }
    })
  }

  return (
    <DashboardStyle.Wrapper>
      <DashboardStyle.Container>
        <Banner
          style={{ marginTop: '84px', marginLeft: 'auto', marginRight: 'auto' }}
          title="StrongNode dVPN coming soon."
          description="Stay tuned for more information."
          soon
        />
        <h1 style={{ marginTop: '56px' }}>DeFi Dashboard</h1>
        <div
          onDragStart={(e) => dragStart(e, 0)}
          onDragEnter={(e) => dragEnter(e, 0)}
          onDragEnd={drop}
          key={0}
          draggable>
          {getComponent(0)}
        </div>
        <DashboardStyle.GridContainer>
          <DashboardStyle.Grid>
            <DashboardStyle.Block
              onDragStart={(e) => dragStart(e, 1)}
              onDragEnter={(e) => dragEnter(e, 1)}
              onDragEnd={drop}
              key={1}
              draggable>
              {getComponent(1)}
            </DashboardStyle.Block>
          </DashboardStyle.Grid>
          <DashboardStyle.Grid>
            <DashboardStyle.Block
              onDragStart={(e) => dragStart(e, 2)}
              onDragEnter={(e) => dragEnter(e, 2)}
              onDragEnd={drop}
              key={2}
              draggable>
              {getComponent(2)}
            </DashboardStyle.Block>
          </DashboardStyle.Grid>
        </DashboardStyle.GridContainer>
        <DashboardStyle.GridContainer>
          <DashboardStyle.Grid>
            <DashboardStyle.Block
              onDragStart={(e) => dragStart(e, 3)}
              onDragEnter={(e) => dragEnter(e, 3)}
              onDragEnd={drop}
              key={3}
              draggable>
              {getComponent(3)}
            </DashboardStyle.Block>
          </DashboardStyle.Grid>
        </DashboardStyle.GridContainer>
      </DashboardStyle.Container>
    </DashboardStyle.Wrapper>
  )
}

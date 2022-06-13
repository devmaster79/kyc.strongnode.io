async function up({ context: queryInterface }) {
  await queryInterface.renameColumn('coinMetricsData', 'usd_value', 'usdValue')
  await queryInterface.renameColumn(
    'coinMetricsData',
    'market_cap',
    'marketCap'
  )
  await queryInterface.renameColumn(
    'coinMetricsData',
    'day_volume',
    'dayVolume'
  )
  await queryInterface.renameColumn(
    'coinMetricsData',
    'day_change',
    'dayChange'
  )
}

async function down({ context: queryInterface }) {
  await queryInterface.renameColumn('coinMetricsData', 'usdValue', 'usd_value')
  await queryInterface.renameColumn(
    'coinMetricsData',
    'marketCap',
    'market_cap'
  )
  await queryInterface.renameColumn(
    'coinMetricsData',
    'dayVolume',
    'day_volume'
  )
  await queryInterface.renameColumn(
    'coinMetricsData',
    'dayChange',
    'day_change'
  )
}

module.exports = { up, down }

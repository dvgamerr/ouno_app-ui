const flex = require('@line-flex')
const LINE = require('@line')
const mssql = require('@mssql')
const aLog = require('../../log-services/log-mongo')

const moment = require('moment')

const SURVEY = process.env.LINE_BOT || 'Cbdf461dd7136e1e7b570d0cb6a2ef9f5'
module.exports = async (req, res) => {
  let pool = { close: () => {} }
  try {
    let hour = parseInt(req.params.hour)
    if (isNaN(hour)) throw new Error('Hour param not int.')
    let command = `
    SELECT COUNT(*) nTask FROM UserTaskSubmit
    WHERE dCheckIn BETWEEN DATEADD(HOUR, -${hour}, GETDATE()) AND GETDATE()
    `
    pool = await mssql()
    let [ [ record ] ] = (await pool.request().query(command)).recordsets
    if (parseInt(record.nTask) === 0) {
      let msg = `ไม่มีข้อมูลในช่วงเวลา ${moment().add(hour * -1, 'hour').format('HH:mm')} - ${moment().format('HH:mm')}`
      LINE('survey', flex.none('Summary Monitor DailyClose', msg), SURVEY)
    }
    aLog(0, 'monitor-daily', 'schedule', 'success', `Checking task 'Monitor DailyClose' last ${hour} hours.`)
  } catch (ex) {
    aLog(0, 'monitor-daily', 'schedule', 'error', ex.stack || ex.message)
  } finally {
    pool.close()
    res.end()
  }
}
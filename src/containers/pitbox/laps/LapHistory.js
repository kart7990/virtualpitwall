import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CCol,
  CRow,
  CDataTable,
  CSelect
} from '@coreui/react'
import { currentDriversSelector  } from '../../../selectors'
import { convertMsToDisplay } from '../../../formatters/UnitConversion'

const LapHistory = (props) => {
  const drivers = useSelector(currentDriversSelector);

  const [selectedCarNumber, setSelectedCarNumber] = useState(-1);

  const fields = ['lapNumber', { key: 'lapTime', label: 'Lap Time', filter: false }]

  const scopedSlots = {
    'lapTime':
      (item) => (
        <td>
          {convertMsToDisplay(item.lapTime)}
        </td>
      )
  }
  return (
    <>
      {props.laps != null &&
        <>
          <CRow>
            <CCol>
              <CSelect name="drivers" id="drivers" onChange={e => setSelectedCarNumber(e.target.value)}>
                <option value="-1">- Select a Driver -</option>
                {drivers?.map(d => {
                  return <option key={d.carNumber} value={d.carNumber}>#{d.carNumber} {d.driverShortName}</option>;
                })}
              </CSelect>
              {selectedCarNumber !== -1 &&
                <CDataTable
                  items={props.laps.filter(l => l.carNumber === selectedCarNumber).sort((a, b) => parseFloat(b.lapNumber) - parseFloat(a.lapNumber))}
                  striped
                  fields={fields}
                  dark
                  hover
                  size="sm"
                  scopedSlots={scopedSlots}
                  itemsPerPage={100}
                  pagination
                />
              }
            </CCol>
          </CRow>
        </>
      }
    </>
  )
}

export default LapHistory
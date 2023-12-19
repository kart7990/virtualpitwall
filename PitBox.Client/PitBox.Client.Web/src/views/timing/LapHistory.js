import React from 'react'
import { useSelector } from 'react-redux'
import {
    CCol,
    CDataTable,
    CRow
} from '@coreui/react'

const LapHistory = (props) => {
    const results = useSelector(state => state.lapHistory);

    const fields = ['carNumber', 'lapNumber', 'position', { key: 'lapTime', label: 'Lap Time', filter: false }]

    const scopedSlots = {
        'lapTime':
            (item) => (
                <td>
                    {item.lapTime.display}
                </td>
            )
    }

    return (
        <>
            {results != null &&
                <CRow>
                    <CCol>
                        <CDataTable
                            items={results.sort((a, b) => parseFloat(b.lapNumber) - parseFloat(a.lapNumber) || parseFloat(b.position) - parseFloat(a.position))}
                            striped
                            fields={fields}
                            dark
                            hover
                            sorter
                            columnFilter
                            size="sm"
                            scopedSlots={scopedSlots}
                            itemsPerPage={100}
                            pagination
                        />
                    </CCol>
                </CRow>
            }
        </>
    )
}

export default LapHistory

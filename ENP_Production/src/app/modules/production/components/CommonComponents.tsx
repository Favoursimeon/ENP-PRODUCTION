import { KTSVG } from "../../../../_metronic/helpers"
import { Button } from 'antd'

const PageActionButtons = (
    { onAddClick, onExportClicked, onUploadClicked, hasAddButton, hasExportButton, hasUploadButton }: any,
) => {
    const addButtonStyle = hasUploadButton && hasExportButton ? 'btn btn-primary me-3' : 'btn btn-light-primary me-3'
    return (
        <div className='d-flex align-items-center'>
            {

                hasAddButton && (
                    <Button
                        type='primary'
                        className={addButtonStyle}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        size='large'
                        onClick={onAddClick}                >
                        <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                        Add
                    </Button>
                )
            }
            {
                hasUploadButton && (
                    <Button type='primary' className='btn btn-light-primary me-3' style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} size='large'
                        onClick={onUploadClicked}
                    >
                        <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                        Upload
                    </Button>
                )
            }

            {
                hasExportButton && (
                    <Button
                        type='primary'
                        className='btn btn-light-primary'
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        size='large'
                        onClick={onExportClicked}>
                        <KTSVG path='/media/icons/duotune/arrows/arr076.svg' className='svg-icon-2' />
                        Export
                    </Button>
                )
            }
        </div>
    )
}

const ModalFooterButtons = ({ onCancel, onSubmit }: any) => {
    return (
        <>
            <Button
                key='back'
                onClick={onCancel}
                size="large">
                Cancel
            </Button>,
            <Button
                key='submit'
                type='primary'
                htmlType='submit'
                onClick={onSubmit}
                size="large">
                Submit
            </Button>,
        </>

    )
}

 //to convert excel date to js date
 const excelDateToJSDate = (serial: number) => {
    const utcDays = Math.floor(serial - 25569)
    const utcValue = utcDays * 86400
    const date = new Date(utcValue * 1000)

    const fractionalDay = serial - Math.floor(serial) + 0.0000001

    let hours = Math.floor(fractionalDay * 24)
    let minutes = Math.floor(fractionalDay * 1440) - (hours * 60)
    let seconds = Math.floor(fractionalDay * 86400) - (hours * 3600) - (minutes * 60)


    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(seconds)

    return date
}

// round off to whole number
const roundOff = (num: number) => {
    return Math.round((num + Number.EPSILON) * 100) / 100
}
export { PageActionButtons, ModalFooterButtons, excelDateToJSDate, roundOff }
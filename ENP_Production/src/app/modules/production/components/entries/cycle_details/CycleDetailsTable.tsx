import { UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal, Space, Table, TabsProps, Tag, Upload, UploadProps, message } from 'antd';
import moment from 'moment';
import { useEffect, useState } from "react";
import { set, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as XLSX from 'xlsx';
import { KTCardBody } from '../../../../../../_metronic/helpers';
import { deleteItem, fetchDocument, postItem, updateItem } from '../../../urls';
import { ModalFooterButtons, PageActionButtons, excelDateToJSDate, roundOff } from '../../CommonComponents';
import { Tabs } from 'antd';



const CycleDetailsTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<any>(null)
    const [gridData, setGridData] = useState([])
    let [filteredData] = useState([])
    const [submitLoading, setSubmitLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [isFileUploaded, setIsFileUploaded] = useState(false)
    const [isCheckDataModalOpen, setIsCheckDataModalOpen] = useState(false)
    const tenantId = localStorage.getItem('tenant')
    const [rowCount, setRowCount] = useState(0)
    const [confirmUploadLoading, setConfirmUploading] = useState(false);

    const [loading, setLoading] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [tempData, setTempData] = useState<any>()
    const { register, reset, handleSubmit } = useForm()
    const queryClient = useQueryClient()
    const [uploadColumns, setUploadColumns] = useState<any>([])
    const [haulerSummary, setHaulerSummary] = useState<any>([])
    const [loaderSummary, setLoaderSummary] = useState<any>([])
    const [originSummary, setOriginSummary] = useState<any>([])
    const [uploadData, setUploadData] = useState<any>([])
    const [uploading, setUpLoading] = useState(false)

    const { data: destinations } = useQuery('destinations', () => fetchDocument(`productionDestination/tenant/${tenantId}`), { cacheTime: 5000 })
    const { data: productionActivities } = useQuery('activity', () => fetchDocument(`ProductionActivity/tenant/${tenantId}`), { cacheTime: 5000 })
    const { data: allHaulerUnits } = useQuery('hauler', () => fetchDocument(`ProHaulerUnit/tenant/${tenantId}`), { cacheTime: 5000 })
    const { data: allHaulers } = useQuery('haulerOperator', () => fetchDocument(`HaulerOperator/tenant/${tenantId}`), { cacheTime: 5000 })
    const { data: allLoaderUnits } = useQuery('allLoaders', () => fetchDocument(`ProLoaderUnit/tenant/${tenantId}`), { cacheTime: 5000 })
    const { data: allLoaders } = useQuery('LoaderOperator', () => fetchDocument(`LoaderOperator/tenant/${tenantId}`), { cacheTime: 5000 })
    const { data: allOrigins } = useQuery('allOrigins', () => fetchDocument(`ProductionOrigin/tenant/${tenantId}`), { cacheTime: 5000 })
    const { data: allMaterials } = useQuery('allMaterials', () => fetchDocument(`ProdRawMaterial/tenant/${tenantId}`), { cacheTime: 5000 })
    const { data: allShifts } = useQuery('shifts', () => fetchDocument(`ProductionShift/tenant/${tenantId}`), { cacheTime: 5000 })


    const handleChange = (event: any) => {
        event.preventDefault()
        setTempData({ ...tempData, [event.target.name]: event.target.value });
    }

    const onTabsChange = (key: string) => {
        console.log(key);
    };

    const showModal = () => {
        setIsModalOpen(true)
    }

    const showUploadModal = () => {
        setIsUploadModalOpen(true)
    }

    const showCheckDataModal = (values: any) => {
        setIsCheckDataModalOpen(true)
    }

    const handleCancel = () => {
        reset()
        setIsModalOpen(false)
        setIsUploadModalOpen(false)
        setIsUpdateModalOpen(false)
        setIsCheckDataModalOpen(false)
    }

    const { mutate: deleteData, isLoading: deleteLoading } = useMutation(deleteItem, {
        onSuccess: (data) => {
            queryClient.setQueryData(['cycleDetails', tempData], data);
            loadData()
        },
        onError: (error) => {
            console.log('delete error: ', error)
        }
    })

    function handleDelete(element: any) {
        const item = {
            url: 'cycleDetails',
            data: element
        }
        deleteData(item)
    }

    const getRecordName = (id: any, data: any) => {
        let name = ''
        data?.map((item: any) => {
            if (item.id === id) {
                name = item.name
            }
        })
        return name
    }

    const getUnitRecordName = (id: any, data: any) => {
        let name = ''
        data?.map((item: any) => {
            if (item.id === id) {
                name = item.modelName
            }
        })
        return name
    }

    const getOperatorRecordName = (id: any, data: any) => {
        let name = ''
        data?.map((item: any) => {
            if (item.empCode === id) {
                name = item.empName
            }
        })
        return name
    }


    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: `Hauler Units`,
            children: (
                <>
                    <Table />
                </>
            ),
        },
        {
            key: '2',
            label: `Loader Units`,
            children: (
                <>
                    <Table />
                </>
            ),
        },
        {
            key: '3',
            label: `Origins`,
            children: (
                <>
                    <Table />
                </>
            ),
        },
        {
            key: '4',
            label: `Destinations`,
            children: (
                <>
                    <Table />
                </>
            ),
        },
    ];


    const columns: any = [
        {
            title: 'Date',
            dataIndex: 'cycleDate',
            key: 'date',
            fixed: 'left',
            width: 150,
        },
        {
            title: 'Shift',
            dataIndex: 'shiftId',
            width: 100,
            render: (record: any) => {
                return getRecordName(record, allShifts?.data)
            }
        },
        {
            title: 'Time',
            dataIndex: 'cycleTime',
            width: 100,
        },
        {
            title: 'Loader Unit',
            dataIndex: 'loaderUnitId',
            width: 150,
            render: (record: any) => {
                return getUnitRecordName(record, allLoaderUnits?.data)
            }
        },
        {
            title: 'Loader Operator',
            dataIndex: 'loader',
            width: 150,
            render: (record: any) => {
                return getOperatorRecordName(record, allLoaders?.data)
            }
        },
        {
            title: 'Hauler Unit',
            dataIndex: 'haulerUnitId',
            width: 150,
            render: (record: any) => {
                return getUnitRecordName(record, allHaulerUnits?.data)
            }
        },
        {
            title: 'Hauler Operator',
            dataIndex: 'hauler',
            width: 150,
            render: (record: any) => {
                return getOperatorRecordName(record, allLoaders?.data)
            }
        },
        {
            title: 'Origin',
            dataIndex: 'originId',
            width: 150,
            render: (record: any) => {
                return getRecordName(record, allOrigins?.data)
            }
        },
        {
            title: 'Material',
            dataIndex: 'materialId',
            width: 120,
            render: (record: any) => {
                return getRecordName(record, allMaterials?.data)
            }
        },
        {
            title: 'Destination',
            dataIndex: 'destinationId',
            width: 150,
            render: (record: any) => {
                return getRecordName(record, destinations?.data)
            }
        },
        {
            title: 'Nominal Weight',
            dataIndex: 'nominalWeight',
            width: 100,
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            width: 100,
        },
        {
            title: 'Payload Weight',
            dataIndex: 'payloadWeight',
            width: 100,
        },
        {
            title: 'Reported Weight',
            dataIndex: 'reportedWeight',
            width: 100,
        },
        {
            title: 'Volume',
            dataIndex: 'volumes',
            width: 100,
        },
        {
            title: 'Loads',
            dataIndex: 'loads',
            width: 100,
        },
        {
            title: 'Time at loader',
            dataIndex: 'timeAtLoader',
            width: 100,
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            width: 100,
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 150,
            render: (_: any, record: any) => (
                <Space size='middle'>
                    <a onClick={() => showUpdateModal(record)} className='btn btn-light-info btn-sm'>
                        Update
                    </a>
                    <a onClick={() => handleDelete(record)} className='btn btn-light-success btn-sm'>
                        Delete
                    </a>
                </Space>
            ),
        },
    ]

    const uploadFileColumns = [
        { title: 'Cyce Date', dataIndex: 'cycleDate', key: 'date', fixed: 'left', width: 120, },
        { title: 'Shift', dataIndex: 'shift', width: 100 },
        { title: 'Time Start', dataIndex: 'timeAtLoader', width: 120 },
        { title: 'Loader Unit', dataIndex: 'loaderUnit', width: 150 },
        { title: 'Loader Operator', dataIndex: 'loader', width: 150 },
        { title: 'Hauler Unit', dataIndex: 'haulerUnit', width: 100 },
        { title: 'Hauler Operator', dataIndex: 'hauler', width: 150 },
        { title: 'Origin', dataIndex: 'origin', width: 150 },
        { title: 'Material', dataIndex: 'material', width: 120 },
        { title: 'Destination', dataIndex: 'destinationId', width: 150 },
        { title: 'Nominal Weight', dataIndex: 'nominalWeight', width: 150 },
        { title: 'Payload Weight', dataIndex: 'payloadWeight', width: 150 },
        { title: 'Reported Weight', dataIndex: 'reportedWeight', width: 150 },
        { title: 'Volume', dataIndex: 'volumes', width: 100 },
        { title: 'Loads', dataIndex: 'loads', width: 100 },
        { title: 'Cycle Time', dataIndex: 'cycleTime', width: 100 },
        { title: 'Duration', dataIndex: 'duration', width: 150 },
    ]

    const onSummaryTabsChange = (key: string) => {
        console.log(key);
    };

    const uploadProps: UploadProps = {
        name: 'file',
        accept: '.xlsx, .xls',
        action: '',
        maxCount: 1,
        beforeUpload: (file: any) => {
            return new Promise((resolve, reject) => {
                resolve(file)
                setUploadedFile(file)
            })
        },
    }

    const newUploadProps: UploadProps = {
        name: 'file',
        accept: '.xlsx, .xls',
        action: '',
        maxCount: 1,
        beforeUpload: (file: any) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsArrayBuffer(file)
                reader.onload = (e: any) => {
                    const data = new Uint8Array(e.target.result)
                    const workbook = XLSX.read(data, { type: 'array' })
                    const sheetName = workbook.SheetNames[0]
                    const sheet = workbook.Sheets[sheetName]
                    const range = "A13:ZZ1100";
                    const json = XLSX.utils.sheet_to_json(sheet, { header: 0, range: range, blankrows: false })
                    const formattedData = json.map((item: any) => {
                        return {
                            cycleDate: moment(excelDateToJSDate(item.Date), 'YYYY-MM-DD').format('DD/MM/YYYY'),
                            shift: item['Shift'],
                            cycleTime: moment(excelDateToJSDate(item['Arrived']), 'HH:mm:ss').format('HH:mm'),
                            loaderUnit: item['Loading Unit'],
                            loader: item['Loader Operator'],
                            hauler: item['Hauler Operator'],
                            haulerUnit: item['Truck'],
                            origin: item['Origin'],
                            material: item['Material'],
                            destination: item['Destination'],
                            nominalWeight: item['Nominal Weight'],
                            payloadWeight: item['Payload Weight'],
                            reportedWeight: item['Reported Weight'],
                            volumes: roundOff(item.Volume),
                            loads: item['Loads'],
                            timeAtLoader: moment(excelDateToJSDate(item['Time Start']), 'HH:mm:ss').format('HH:mm'),
                            duration: item['Travel Empty Duration'],
                        }
                    })

                    const newCol = [
                        { title: 'Cyce Date', dataIndex: 'cycleDate', key: 'date', fixed: 'left', width: 120, },
                        { title: 'Shift', dataIndex: 'shift', width: 100 },
                        { title: 'Time Start', dataIndex: 'timeAtLoader', width: 120 },
                        { title: 'Loader Unit', dataIndex: 'loaderUnit', width: 150 },
                        { title: 'Loader Operator', dataIndex: 'loader', width: 150 },
                        { title: 'Hauler Unit', dataIndex: 'haulerUnit', width: 100 },
                        { title: 'Hauler Operator', dataIndex: 'hauler', width: 150 },
                        { title: 'Origin', dataIndex: 'origin', width: 150 },
                        { title: 'Material', dataIndex: 'material', width: 120 },
                        { title: 'Destination', dataIndex: 'destination', width: 150 },
                        { title: 'Nominal Weight', dataIndex: 'nominalWeight', width: 150 },
                        { title: 'Payload Weight', dataIndex: 'payloadWeight', width: 150 },
                        { title: 'Reported Weight', dataIndex: 'reportedWeight', width: 150 },
                        { title: 'Volume', dataIndex: 'volumes', width: 100 },
                        { title: 'Loads', dataIndex: 'loads', width: 100 },
                        { title: 'Cycle Time', dataIndex: 'cycleTime', width: 100 },
                        { title: 'Duration', dataIndex: 'duration', width: 150 },
                    ]


                    setRowCount(formattedData.length)
                    setIsFileUploaded(true)
                    console.log('upload: ', formattedData.slice(0, 10))
                    setUploadData(formattedData.slice(1))
                    setUploadColumns(newCol)
                }
                resolve(file)
            })
        },
    }



    // convert populated data from excel file to database 
    const saveTableObjects = () => {

        uploadData.map((item: any,) => {

            const destinationId = destinations?.data.find((dest: any) => dest.name.trim() === item.destination.trim());
            const haulerUnitId = allHaulerUnits?.data.find((unit: any) => unit.equipmentId.trim() === item.haulerUnit.trim());
            const hauler = allHaulers?.data.find((op: any) => op.empName.trim() === item.hauler.trim());
            const loaderUnitId = allLoaderUnits?.data.find((unit: any) => unit.equipmentId.trim() === item.loaderUnit.trim());
            const loader = allLoaders?.data.find((op: any) => op.empName.trim() === item.loader.trim());
            const originId = allOrigins?.data.find((ori: any) => ori.name.trim() === item.origin.trim());
            const materialId = allMaterials?.data.find((mat: any) => mat.name.trim() === item.material.trim());
            const shiftId = allShifts?.data.find((s: any) => s.name.trim() === item.shift.trim());

            // check if the id of any of the data is not found 
                if (!destinationId || !haulerUnitId || !hauler || !loaderUnitId || !loader || !originId || !materialId || !shiftId) {
                    //    if (!hasMissingIds) {
                      //      message.error('Some columns have unfound values. Please check your data and try again')
                    //        hasMissingIds = true;
                    return
                    // }
                } else {
                    //message.success('Data is valid')

                    const obj = {
                    data: {              
                        cycleDate: item.cycleDate,
                        cycleTime: item.cycleTime,
                        loader: loader?.empCode,
                        hauler: hauler?.empCode,
                        loaderUnitId: parseInt(loaderUnitId?.id),
                        haulerUnitId: parseInt(haulerUnitId?.id),
                        originId: parseInt(originId?.id),
                        materialId: parseInt(materialId?.id),
                        destinationId: parseInt(destinationId?.id),
                        nominalWeight: parseInt(item.nominalWeight),
                        weight: parseInt(item.nominalWeight),
                        payloadWeight: parseInt(item.payloadWeight),
                        reportedWeight: parseInt(item.reportedWeight),
                        volumes: parseInt(item.volumes),
                        loads: parseInt(item.loads),
                        timeAtLoader: item.timeAtLoader,
                        shiftId: parseInt(shiftId?.id),
                        duration: parseInt(item.duration),
                        tenantId: tenantId,
                        batchNumber: `${haulerUnitId?.id}-${moment().format('DDMMYYHHmmss')}`
                    },
                    url: 'cycleDetails',
                }
                console.log('dataToSave', obj.data);
                postData(obj)
            }          

        });

        // dataToSave.map((item: any) => {
        //     const data = {
        //         data: item,
        //         url: 'cycleDetails',
        //     }
        //     console.log('dataToSave', data);
        //     //postData(data)
        // });

    }

    const handleUpload = () => {

        setIsUploadModalOpen(false)
        setIsFileUploaded(true)
        const reader = new FileReader()
        reader.onload = (e: any) => {
            const file = new Uint8Array(e.target.result)
            const workBook = XLSX.read(file, { type: 'array' })
            const workSheetName = workBook.SheetNames[0]
            const workSheet: any = workBook.Sheets[workSheetName]

            // sets the range to be read from the excel file
            const range = "A13:ZZ1100";

            const data: any = XLSX.utils.sheet_to_json(workSheet, { header: 0, range: range, blankrows: false })
            const filteredData = data
                .map((item: any) => {
                    return {
                        cycleDate: moment(excelDateToJSDate(item.Date), 'YYYY-MM-DD').format('DD/MM/YYYY'),
                        shift: item['Shift'],
                        cycleTime: moment(excelDateToJSDate(item['Arrived']), 'HH:mm:ss').format('HH:mm'),
                        loaderUnit: item['Loading Unit'],
                        loader: item['Loader Operator'],
                        hauler: item['Hauler Operator'],
                        haulerUnit: item['Truck'],
                        origin: item['Origin'],
                        material: item['Material'],
                        destination: item['Destination'],
                        nominalWeight: item['Nominal Weight'],
                        payloadWeight: item['Payload Weight'],
                        reportedWeight: item['Reported Weight'],
                        volumes: roundOff(item.Volume),
                        loads: item['Loads'],
                        timeAtLoader: moment(excelDateToJSDate(item['Time Start']), 'HH:mm:ss').format('HH:mm'),
                        duration: item['Travel Empty Duration'],
                    }
                })

            setRowCount(filteredData.length)

            setUploadColumns(uploadFileColumns)
            setUploadData(filteredData.slice(1))
            setIsUploadModalOpen(false)
            console.log('read data: ', filteredData.slice(0, 10))
        }
        reader.readAsArrayBuffer(uploadedFile)
    }


    const loadData = async () => {
        setLoading(true)
        try {
            const response = await fetchDocument(`cycleDetails/tenant/${tenantId}`)
            setGridData(response.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            message.error(`${error}`)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const dataWithIndex = gridData.map((item: any, index) => ({
        ...item,
        key: index,
    }))

    const handleInputChange = (e: any) => {
        setSearchText(e.target.value)
        if (e.target.value === '') {
            loadData()
        }
    }

    const globalSearch = () => {
        // @ts-ignore
        filteredData = dataWithVehicleNum.filter((value) => {
            return (
                value.fleetID.toLowerCase().includes(searchText.toLowerCase()) ||
                value.modlName.toLowerCase().includes(searchText.toLowerCase())
            )
        })
        setGridData(filteredData)
    }
    const { isLoading: updateLoading, mutate: updateData } = useMutation(updateItem, {
        onSuccess: (data) => {
            queryClient.setQueryData(['cycleDetails', tempData], data);
            reset()
            setTempData({})
            loadData()
            setIsUpdateModalOpen(false)
            setIsModalOpen(false)
        },
        onError: (error) => {
            console.log('error: ', error)
            message.error(`${error}`)
        }
    })

    const handleUpdate = (e: any) => {
        e.preventDefault()
        const item = {
            url: 'cycleDetails',
            data: tempData
        }
        updateData(item)
        console.log('update: ', item.data)
    }

    const showUpdateModal = (values: any) => {
        showModal()
        setIsUpdateModalOpen(true)
        setTempData(values);
        console.log(values)
    }



    //hide Update table 
    const clearUpdateTable = () => {
        setIsFileUploaded(false)
        setUploadedFile(null)
        loadData()
    }


    const OnSubmit = handleSubmit(async (values) => {
        setSubmitLoading(true)
        const item = {
            data: {
                cycleDate: values.cycleDate,
                shiftId: parseInt(values.shiftId),
                cycleTime: values.cycleTime,
                loader: values.loader,
                hauler: values.hauler,
                haulerUnitId: parseInt(values.haulerUnitId),
                loaderUnitId: parseInt(values.loaderUnitId),
                originId: parseInt(values.originId),
                materialId: parseInt(values.materialId),
                destinationId: parseInt(values.destinationId),
                nominalWeight: parseInt(values.nominalWeight),
                weight: parseInt(values.weight),
                payloadWeight: parseInt(values.payloadWeight),
                reportedWeight: parseInt(values.reportedWeight),
                volume: parseInt(values.volume),
                loads: parseInt(values.loads),
                timeAtLoader: values.timeAtLoader,
                duration: parseInt(values.duration),
                tenantId: tenantId,
                batchNumber: `${values.haulerUnitId}-${moment().format('DDMMYYHHmmss')}`,
            },
            url: 'cycleDetails'
        }
        console.log(item.data)
        postData(item)

    })

    const { mutate: postData, isLoading: postLoading } = useMutation(postItem, {
        onSuccess: (data) => {
            queryClient.setQueryData(['cycleDetails', tempData], data);
            reset()
            setTempData({})
            loadData()
            setIsModalOpen(false)
            setSubmitLoading(false)
        },
        onError: (error) => {
            setSubmitLoading(false)
            console.log('post error: ', error)
            message.error(`${error}`)
        }
    })


    return (
        <div className="card card-custom card-flush" >
            <div className="card-header mt-7">
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        placeholder='Enter Search Text'
                        type='text'
                        allowClear size='large'
                    />
                    <Button type='primary' size='large'>
                        Search
                    </Button>
                </Space>
                <div className="card-toolbar">
                    <Space style={{ marginBottom: 16 }}>
                        {
                            isFileUploaded ?
                                <Space>
                                    <Button onClick={showCheckDataModal}
                                        type='primary' size='large'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        className='btn btn-light-success btn-sm'
                                    >
                                        Check data
                                    </Button>
                                    <Button onClick={saveTableObjects}
                                        type='primary' size='large'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} className='btn btn-light-success btn-sm'>
                                        Save
                                    </Button>
                                    <Button onClick={clearUpdateTable}
                                        type='primary' size='large'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} className='btn btn-light-info btn-sm'>
                                        Clear
                                    </Button>
                                </Space>
                                :
                                <PageActionButtons
                                    onAddClick={showModal}
                                    onExportClicked={() => { console.log('export clicked') }}
                                    onUploadClicked={showUploadModal}
                                    hasAddButton={true}
                                    hasExportButton={true}
                                    hasUploadButton={true}
                                />
                        }
                    </Space>
                </div>
            </div>
            <KTCardBody className='py-4 '>
                <div className='table-responsive'>
                    <div className='d-flex  justify-content-between'>

                    </div>

                    <Table
                        columns={isFileUploaded ? uploadColumns : columns}
                        dataSource={isFileUploaded ? uploadData : gridData}
                        scroll={{ x: 1300 }}
                        loading={loading}
                    />


                    <Modal
                        title={isUpdateModalOpen ? 'Update Cycle Details' : 'Cycle Details Setup'}
                        open={isModalOpen}
                        onCancel={handleCancel}
                        width={800}
                        closable={true}
                        footer={
                            <ModalFooterButtons
                                onCancel={handleCancel}
                                onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmit} />
                        }
                    >
                        <form onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmit}>
                            <hr></hr>
                            <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Date</label>
                                    <input type="date" {...register("cycleDate")} name="cycleDate" defaultValue={!isUpdateModalOpen ? '' : tempData?.cycleDate} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Shift</label>
                                    <select
                                        {...register("shiftId")}
                                        onChange={handleChange}
                                        className="form-select form-select-white" aria-label="Select example">
                                        {!isUpdateModalOpen && <option>Select</option>}
                                        {
                                            allShifts?.data.map((item: any) => (
                                                <option
                                                    selected={isUpdateModalOpen && item.name === tempData.shiftId}
                                                    value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div style={{ padding: "0 20px 0 20px" }} className='row mb-0 '>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Time</label>
                                    <input type="time" {...register("cycleTime")} name="cycleTime" defaultValue={!isUpdateModalOpen ? '' : tempData?.cycleTime} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Loader</label>
                                    <select
                                        {...register("loader")}
                                        onChange={handleChange}
                                        className="form-select form-select-white" aria-label="Select example">
                                        {!isUpdateModalOpen && <option>Select</option>}
                                        {
                                            allLoaders?.data.map((item: any) => (
                                                <option
                                                    selected={isUpdateModalOpen && item.modelName === tempData.loader}
                                                    value={item.empCode}>{item.empCode}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div style={{ padding: "0 20px 0 20px" }} className='row mb-0 '>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Hauler</label>
                                    <select
                                        {...register("hauler")}
                                        onChange={handleChange}
                                        className="form-select form-select-white" aria-label="Select example">
                                        {!isUpdateModalOpen && <option>Select</option>}
                                        {
                                            allHaulers?.data.map((item: any) => (
                                                <option
                                                    selected={isUpdateModalOpen && item.modelName === tempData.hauler}
                                                    value={item.empCode}>{item.empCode}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Origin</label>
                                    <select
                                        {...register("originId")}
                                        onChange={handleChange}
                                        className="form-select form-select-white" aria-label="Select example">
                                        {!isUpdateModalOpen && <option>Select</option>}
                                        {
                                            allOrigins?.data.map((item: any) => (
                                                <option
                                                    selected={isUpdateModalOpen && item.name === tempData.originId}
                                                    value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div style={{ padding: "0 20px 0 20px" }} className='row mb-0 '>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Hauler Unit</label>
                                    <select
                                        {...register("haulerUnitId")}
                                        onChange={handleChange}
                                        className="form-select form-select-white" aria-label="Select example">
                                        {!isUpdateModalOpen && <option>Select</option>}
                                        {
                                            allHaulerUnits?.data.map((item: any) => (
                                                <option
                                                    selected={isUpdateModalOpen && item.id === tempData.haulerUnitId}
                                                    value={item.id}>{item.modelName}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Loader Unit</label>
                                    <select
                                        {...register("loaderUnitId")}
                                        onChange={handleChange}
                                        className="form-select form-select-white" aria-label="Select example">
                                        {!isUpdateModalOpen && <option>Select</option>}
                                        {
                                            allLoaderUnits?.data.map((item: any) => (
                                                <option
                                                    selected={isUpdateModalOpen && item.id === tempData.loaderUnitId}
                                                    value={item.id}>{item.modelName}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                            </div>
                            <div style={{ padding: "0 20px 0 20px" }} className='row mb-0 '>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Material</label>
                                    <select
                                        {...register("materialId")}
                                        onChange={handleChange}
                                        className="form-select form-select-white" aria-label="Select example">
                                        {!isUpdateModalOpen && <option>Select</option>}
                                        {
                                            allMaterials?.data.map((item: any) => (
                                                <option
                                                    selected={isUpdateModalOpen && item.id === tempData.materialId}
                                                    value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Destination</label>
                                    <select
                                        {...register("destinationId")}
                                        onChange={handleChange}
                                        className="form-select form-select-white" aria-label="Select example">
                                        {!isUpdateModalOpen && <option>Select</option>}
                                        {
                                            destinations?.data.map((item: any) => (
                                                <option
                                                    selected={isUpdateModalOpen && item.id === tempData.destinationId}
                                                    value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div style={{ padding: "0 20px 0 20px" }} className='row mb-0 '>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Nominal Weight</label>
                                    <input type="number" {...register("nominalWeight")} name="nominalWeight" min={0} defaultValue={!isUpdateModalOpen ? 0 : tempData?.nominalWeight} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Weight</label>
                                    <input type="number" {...register("weight")} name="weight" min={0} defaultValue={!isUpdateModalOpen ? 0 : tempData?.weight} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                            </div>
                            <div style={{ padding: "0 20px 0 20px" }} className='row mb-0 '>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Payload Weight</label>
                                    <input type="number" {...register("payloadWeight")} name="payloadWeight" min={0} defaultValue={!isUpdateModalOpen ? 0 : tempData?.payloadWeight} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Reported Weight</label>
                                    <input type="number" {...register("reportedWeight")} name="reported_weight" min={0} defaultValue={!isUpdateModalOpen ? 0 : tempData?.reportedWeight} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                            </div>
                            <div style={{ padding: "0 20px 0 20px" }} className='row mb-0 '>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Volume</label>
                                    <input type="number" {...register("volume")} name="volumes" min={0} defaultValue={!isUpdateModalOpen ? 0 : tempData?.volumes} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Loads</label>
                                    <input type="number" {...register("loads")} name="loads" min={0} defaultValue={!isUpdateModalOpen ? 0 : tempData?.loads} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                            </div>
                            <div style={{ padding: "0 20px 0 20px" }} className='row mb-0 '>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Time at Loader</label>
                                    <input type="time" {...register("timeAtLoader")} name="timeAtLoader" defaultValue={!isUpdateModalOpen ? '' : tempData?.timeAtLoader} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                                <div className='col-6 mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="required form-label">Duration</label>
                                    <input type="number" {...register("duration")} name="duration" min={0} defaultValue={!isUpdateModalOpen ? 0 : tempData?.duration} onChange={handleChange} className="form-control form-control-white" />
                                </div>
                            </div>
                        </form>
                    </Modal>
                    {/* Modal to upload file */}

                    <Modal
                        title='Upload Cycle Detail'
                        open={isUploadModalOpen}
                        onOk={handleUpload}
                        // confirmLoading={confirmUploadLoading}
                        onCancel={handleCancel}
                        closable={true}
                    >
                        <Divider />
                        <Space size='large'>
                            <Upload
                                {...uploadProps}
                            >
                                <Button
                                    loading={loading}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Space>
                    </Modal>

                    {/* check data modal */}
                    <Modal
                        title='Data Summaries'
                        open={isCheckDataModalOpen}
                        onCancel={handleCancel}
                        width={800}
                        closable={true}
                        footer={
                            <>
                                <Button onClick={handleCancel}
                                    type='primary' size='large'
                                    className='btn btn-light btn-sm w'>
                                    Ok
                                </Button>
                            </>}
                    >

                        <Tabs defaultActiveKey="1"
                            items={tabItems}
                            onChange={onTabsChange}
                            tabBarExtraContent={
                                <>
                                    <Tag color="geekblue">{rowCount} rows </Tag>
                                </>
                            } />
                    </Modal>

                </div>
            </KTCardBody >
        </div >
    )
}

export { CycleDetailsTable };


import {Button, Form, Input, InputNumber, Modal, Space, Table} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../_metronic/helpers'
import { ENP_URL } from '../../../urls'

const Benefit = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${ENP_URL}/ProductionActivity/${element.id}`)
      // update the local state so that react can refecth and re-render the table with the new data
      const newData = gridData.filter((item: any) => item.id !== element.id)
      setGridData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }

  

  function handleDelete(element: any) {
    deleteData(element)
  }
  const columns: any = [
   
    {
      title: 'Code',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Description',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Type of Amount',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Amount',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Amount Number',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },

    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          
          {/* <Link to={`/setup/sections/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Sections</span>
          </Link> */}
          <a href='#' className='btn btn-light-warning btn-sm'>
            Update
          </a>
          <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
            Delete
          </a>
         
        </Space>
      ),
      
    },
  ]

  const BENEFITS =[
    {
     "Code": "001",
     "Name": "CLOT",
     "Description": "CLOTHING ALLOWANCE",
     "Category": "PERMANENT",
     "Type of Amount": "FORMULA",
     "Amount": 0,
     "Account No.": 1234560,
     "Period Type": "MONTHLY",
     "Period Interval": "MONTHLY",
     "Currency": "GHS",
     "Accrued": "NO",
     "Tax Type": "TAX TABLE",
     "isTaxable": "YES"
    },
    {
     "Code": "002",
     "Name": "ACCOM",
     "Description": "ACCOMODATION ALLOWANCE",
     "Category": "SERVICE",
     "Type of Amount": "PERCENTAGE OF GROSS",
     "Amount": 0,
     "Account No.": 1234561,
     "Period Type": "MONTHLY",
     "Period Interval": "MONTHLY",
     "Currency": "GHS",
     "Accrued": "NO",
     "Tax Type": "TAX FORMULA",
     "isTaxable": "YES"
    },
    {
     "Code": "003",
     "Name": "MED",
     "Description": "MEDICAL ALLOWANCE",
     "Category": "PERMANENT",
     "Type of Amount": "VARYING AMOUNT",
     "Amount": 0,
     "Account No.": 1234562,
     "Period Type": "AMOUNT",
     "Period Interval": "AMOUNT",
     "Currency": "GHS",
     "Accrued": "NO",
     "Tax Type": "NON TAXABLE",
     "isTaxable": "NO"
    },
    {
     "Code": "004",
     "Name": "TRAV",
     "Description": "TRAVELLING ALLOWANCE",
     "Category": "SENIOR STAFF",
     "Type of Amount": "VARYING AMOUNT",
     "Amount": 0,
     "Account No.": 1234563,
     "Period Type": "WEEKLY",
     "Period Interval": "WEEKLY",
     "Currency": "GHS",
     "Accrued": "NO",
     "Tax Type": "TAX FORMULA",
     "isTaxable": "NO"
    },
    {
     "Code": "005",
     "Name": "RND",
     "Description": "RESEARCH ALLOWANCE",
     "Category": "SENIOR STAFF",
     "Type of Amount": "PERCENTAGE OF BASIC",
     "Amount": 0,
     "Account No.": 1234564,
     "Period Type": "ANNUAL",
     "Period Interval": "ANNUAL",
     "Currency": "GHS",
     "Accrued": "NO",
     "Tax Type": "TAX RATE",
     "isTaxable": "YES"
    }
   ]

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${ENP_URL}/ProductionActivity`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
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
        value.name.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }

  const url = `${ENP_URL}/ProductionActivity`
  const onFinish = async (values: any) => {
    setSubmitLoading(true)
    const data = {
      name: values.name,
    }

    console.log(data)

    try {
      const response = await axios.post(url, data)
      setSubmitLoading(false)
      form.resetFields()
      setIsModalOpen(false)
      loadData()
      return response.statusText
    } catch (error: any) {
      setSubmitLoading(false)
      return error.statusText
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
          <div className='d-flex justify-content-between'>
            <Space style={{marginBottom: 16}}>
              <Input
                placeholder='Enter Search Text'
                onChange={handleInputChange}
                type='text'
                allowClear
                value={searchText}
              />
              <Button type='primary' onClick={globalSearch}>
                Search
              </Button>
            </Space>
            <Space style={{marginBottom: 16}}>
              <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>

              <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
            </button>
            </Space>
          </div>
          <Table columns={columns}  />
          <Modal
                title='Benefit Setup'
                open={isModalOpen}
                onCancel={handleCancel}
                closable={true}
                width={860}
                footer={[
                    <Button key='back' onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                    key='submit'
                    type='primary'
                    htmlType='submit'
                    loading={submitLoading}
                    onClick={() => {
                      form.submit()
                    }}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <Form
                    labelCol={{span: 7}}
                    wrapperCol={{span: 14}}
                    layout='horizontal'
                    form={form}
                    name='control-hooks'
                    onFinish={onFinish}
                >
                  <hr></hr>
                  <div style={{padding: "20px 20px 0 20px"}} className='row mb-0 '>
                    <div className='col-6 mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="required form-label">Code</label>
                      <input type="text" name="code"  className="form-control form-control-solid"/>
                    </div>
                    <div className='col-6 mb-7'>
                    <label htmlFor="exampleFormControlInput1" className="required form-label">Name</label>
                      <input type="text" name="name"  className="form-control form-control-solid"/>
                      
                    </div>
                  </div>
                  <div style={{padding: "0px 20px 0 20px"}} className='row mb-0 '>
                    <div className='col-6 mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="required form-label">Description</label>
                      <input type="text" name="desc"  className="form-control form-control-solid"/>
                    </div>
                    <div className='col-6 mb-7'>
                    <label htmlFor="exampleFormControlInput1" className="required form-label">Category</label>
                      {/* <input type="text" name="field1"  className="form-control form-control-solid"/> */}
                      <select className="form-select form-select-solid" aria-label="Select example">
                        <option> select</option>
                        <option value="1">Yes</option>
                        <option value="2">No</option>
                      </select>
                    </div>
                  </div>
                  <div style={{padding: "0px 20px 0 20px"}} className='row mb-0 '>
                    <div className='col-6 mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="required form-label">Type of Amount</label>
                      <select className="form-select form-select-solid" aria-label="Select example">
                        <option> select</option>
                        <option value="1">Yes</option>
                        <option value="2">No</option>
                      </select>
                    </div>
                    <div className='col-6 mb-7'>
                    <label htmlFor="exampleFormControlInput1" className="required form-label">Amount</label>
                      <input type="number" min={0} name="amount" defaultValue={0.00} className="form-control form-control-solid"/>
                      
                    </div>
                  </div>
                  <div style={{padding: "0px 20px 0 20px"}} className='row mb-0 '>
                    <div className='col-6 mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="required form-label">Account No.</label>
                      <input type="text" name="accno"  className="form-control form-control-solid"/>
                    </div>
                    <div className='col-6 mb-7'>
                    <label htmlFor="exampleFormControlInput1" className="required form-label">Period Type</label>
                      {/* <input type="text" name="field1"  className="form-control form-control-solid"/> */}
                      <select className="form-select form-select-solid" aria-label="Select example">
                        <option> select</option>
                        <option value="1">Monthly</option>
                        <option value="2">Yearly</option>
                      </select>
                    </div>
                  </div>
                  <div style={{padding: "0px 20px 0 20px"}} className='row mb-0 '>
                    <div className='col-6 mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="required form-label">Period Interval</label>
                      <select className="form-select form-select-solid" aria-label="Select example">
                        <option> select</option>
                        <option value="1">Weekly</option>
                        <option value="2">Monthly</option>
                      </select>
                    </div>
                    <div className='col-6 mb-7'>
                    <label htmlFor="exampleFormControlInput1" className="required form-label">Currency</label>
                      {/* <input type="text" name="name"  className="form-control form-control-solid"/> */}
                      <select className="form-select form-select-solid" aria-label="Select example">
                        <option> select</option>
                        <option value="1">Cedis</option>
                        <option value="2">Dollar</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{padding: "0px 20px 0 20px"}} className='row mb-0 '>
                    <div className='col-6 mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="required form-label">Accrued</label>
                      <select className="form-select form-select-solid" aria-label="Select example">
                        <option> select</option>
                        <option value="1">Yes</option>
                        <option value="2">No</option>
                      </select>
                    </div>
                    <div className='col-6 mb-7'>
                    <label htmlFor="exampleFormControlInput1" className="required form-label">Tax Type</label>
                      {/* <input type="text" name="field1"  className="form-control form-control-solid"/> */}
                      <select className="form-select form-select-solid" aria-label="Select example">
                        <option> select</option>
                        <option value="1">test1 </option>
                        <option value="2">test2 </option>
                      </select>
                    </div>
                  </div>
                  <div style={{padding: "0px 20px 0 20px"}} className='row mb-0 '>
                    <div className='col-6 mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="required form-label">Start Period</label>
                      <input type="date" name="period"  className="form-control form-control-solid"/>
                    </div>
                    <div className='col-6 mb-7'>
                    <label htmlFor="exampleFormControlInput1" className="required form-label">isTaxable</label>
                      {/* <input type="text" name="field1"  className="form-control form-control-solid"/> */}
                      <select className="form-select form-select-solid" aria-label="Select example">
                        <option>select</option>
                        <option value="1">Yes </option>
                        <option value="2">No </option>
                      </select>
                    </div>
                  </div>
                </Form>
            </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export {Benefit}

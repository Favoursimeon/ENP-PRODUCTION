import {Button, Form, Input, InputNumber, Modal, Space, Table} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../_metronic/helpers'
import { ENP_URL } from '../../../urls'
import { useForm } from 'react-hook-form'
import { Api_Endpoint, fetchJobTitles, fetchSkills } from '../../../../../services/ApiCalls'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'

const JobTitleSkill = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const {register, reset, handleSubmit} = useForm()
  const param:any  = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false)
  let [itemName, setItemName] = useState<any>("")

  const tenantId = localStorage.getItem('tenant')
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    reset()
    setIsModalOpen(false)
  }

  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${Api_Endpoint}/JobTitleSkills/${element.id}`)
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
   
    // {
    //   title: 'Code',
    //   dataIndex: 'code',
    //   sorter: (a: any, b: any) => {
    //     if (a.code > b.code) {
    //       return 1
    //     }
    //     if (b.code > a.code) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },
    {
      title: 'Name',
      key:'skillId',
      render: (row: any) => {
        return getSkillName(row.skillId)
      },
      sorter: (a: any, b: any) => {
        if (a.skillId > b.skillId) {
          return 1
        }
        if (b.skillId > a.skillId) {
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
          {/* <a href='#' className='btn btn-light-warning btn-sm'>
            Update
          </a> */}
          <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
            Delete
          </a>
         
        </Space>
      ),
      
    },
  ]
  const loadData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Api_Endpoint}/JobTitleSkills/tenant/${tenantId}`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  const getItemName= async (param:any) =>{

    let newName=null
  
     const   itemTest = await allJobTitles?.data.find((item:any) =>
      item.id.toString()===param
    )
     newName = await itemTest
    return newName
 }

  useEffect(() => {
    (async ()=>{
        let res = await getItemName(param.id)
        setItemName(res?.name)
      })();
    loadData()
  }, [])

  const dataWithIndex = gridData.map((item: any, index) => ({
    ...item,
    key: index,
  }))

  const dataByID = gridData.filter((skill:any) =>{
    return skill.jobTitleId.toString() ===param.id
  })

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
  const getSkillName = (skillId: any) => {
    let skillName = null
    allSkills?.data.map((item: any) => {
      if (item.id === skillId) {
        skillName=item.name
      }
    })
    return skillName
  } 

  const {data:allJobTitles} = useQuery('jobtitle', fetchJobTitles, {cacheTime:5000})
  const {data:allSkills} = useQuery('skills', fetchSkills, {cacheTime:5000})
  
  const url = `${Api_Endpoint}/JobTitleSkills`
  const OnSUbmit = handleSubmit( async (values)=> {
    setLoading(true)
    const data = {
          jobTitleId: parseInt(param.id),
          skillId: values.skillId,
          tenantId: tenantId,
        }
    try {
      const response = await axios.post(url, data)
      setSubmitLoading(false)
      reset()
      setIsModalOpen(false)
      loadData()
      return response.statusText
    } catch (error: any) {
      setSubmitLoading(false)
      return error.statusText
    }
  })

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
        <h3 style={{fontWeight:"bolder"}}>{itemName} </h3>
        <br></br>
        <button className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' onClick={() => navigate(-1)}>Go Back</button>
        <br></br>
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
          <Table columns={columns}  dataSource={dataByID} loading={loading} />
          <Modal
                title='JobTitle Skill Setup'
                open={isModalOpen}
                onCancel={handleCancel}
                closable={true}
                footer={[
                    <Button key='back' onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                    key='submit'
                    type='primary'
                    htmlType='submit'
                    loading={submitLoading}
                    onClick={OnSUbmit}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <form
                    onSubmit={OnSUbmit}
                >
                  <hr></hr>
                  <div style={{padding: "20px 20px 20px 20px"}} className='row mb-0 '>
                    <div className=' mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Skill</label>
                      {/* <input type="text" {...register("code")}  className="form-control form-control-solid"/> */}
                      <select {...register("skillId")} className="form-select form-select-solid" aria-label="Select example">
                        <option>select </option>
                            {allSkills?.data.map((item: any) => (
                                <option value={item.id}>{item.name}</option>
                            ))}
                       </select>
                    </div>
                    
                  </div>
                </form>
            </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export {JobTitleSkill}

import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const TaskPage = ()=>{
    const [taskTitle,setTaskTitle] = useState('')
    const [error,setError] = useState('')
    const [task,setTask] = useState([]) 
    const userData = JSON.parse(localStorage.getItem('userData'))
    const navigate = useNavigate()

    useEffect(()=>{
       getTask()
    },[])

    const getTask = ()=>{
        axios.get(`http://localhost:8000/api/task/${userData.id}`,{
            headers:{
                Authorization:userData.token
            }
        })
        .then((res)=>{
            setTask(res.data.task)
        })
        .catch((res)=>{
            setTask([])
        })
    }

    const handleCreateTask = ()=>{
        if(taskTitle===''){
            setError('Enter title')
        }else{
            let {token,id} = userData
            axios.post(`http://localhost:8000/api/task`,{title:taskTitle,userId:id},{
                headers:{
                    Authorization:token
                }
            }).then((res)=>{
                setTaskTitle('')
                getTask()
            })
        }
    }

    const getObj = (status)=>{
        if(status==='start'){
            return {status,startTime:Date.now()}
        }else{
            return {status,completionTime:Date.now()}
        }
    }
    const updateTask = (id,status)=>{
        axios.put(`http://localhost:8000/api/task/${id}`,getObj(status),{
            headers:{
                Authorization:userData.token
            }
        }).then((res)=>{
            getTask()
        })
    }

    const getTime = (time)=>{
        let utcDate = new Date(time)
        const local = utcDate.toLocaleString()
        return local
    }
    
    const handleLogout = ()=>{
        localStorage.removeItem('userData')
        navigate('/')
    }
    return(
        <>
             <div style={{display:'flex',justifyContent:"space-between"}}>
                <h1>Welcome {userData.name}</h1>
                <div style={{display:'flex',height:'50px'}}>
                    <div style={{backgroundImage:`url(${userData.image})`,backgroundSize:'contain',borderRadius:'45%',height:'45px',width:'45px'}}></div>
                    <p onClick={handleLogout} style={{marginTop:'15px'}}>Logout</p>
                </div>
            </div>
            <h1 style={{textAlign:'center'}}>Tasks</h1>
            <div>
                <h3>Task List</h3>
                {task.length===0 && <p>No tasks</p>}
                {task.map((value)=>{
                    return(
                        <div style={{border:'1px solid black',margin:'8px',padding:'8px'}}>
                            <h5>{value.title}</h5>
                            <p style={{color:'blue'}}>Status:{value.status}</p>
                            {value.startTime && <p>Started at {getTime(value.startTime)}</p>}
                            {value.completionTime && <p>Completed at {getTime(value.completionTime)}</p>}
                            {value.status==='not started' ?  
                            <button onClick={()=>updateTask(value._id,'start')}>Start</button> : value.status==='start' ? 
                            <button onClick={()=>updateTask(value._id,'complete')}>Complete</button> : '' 
                            }
                        </div>
                    )
                })}
            </div>
            <div>
                <h3>Create Task</h3>
                <input placeholder="Enter Task Title" type="text" value={taskTitle} onChange={(e)=>setTaskTitle(e.target.value)} />
                <p>{error}</p>
                <button onClick={handleCreateTask}>Create</button>
            </div>
            <div>
                
            </div>
        </>
    )
}

export default TaskPage;

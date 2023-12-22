import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import LoginPage from "./loginPage";
import TaskPage from "./taskPage";

const App = ()=>{
    const token = localStorage.getItem('userData')
    console.log(token)
    return(
        <>
            <BrowserRouter>
                <Routes>
                    {token===null ?  <Route path="*" element={<LoginPage/>} /> :
                        <>
                        <Route path="/" element={<LoginPage/>} />
                        <Route path="/task" element={<TaskPage/>} />
                        </>
                    }
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;
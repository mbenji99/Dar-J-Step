import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

function Login(){
    return (
        <div className='d-flex justify-content-center align-items-center bg -primary' >
            <div classname='p-3 bg-white w-25'>
                <form action="">   
                <div classname='mb-3'>
                        <label htmlFor='name'>name</label>
                        <input type="name" placeholder='Enter Name'classname='form-control' />
                    </div>
                    <div classname='mb-3' >
                        <label htmlFor='password'>password</label>
                        <input type="password" placeholder='Enter Password'classname='form-control'/>
                    </div>
                    <button classname='btn btn success'  >Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login
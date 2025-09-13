import { use, useState } from 'react'


import { useAuth} from '../context/AuthContext';



export default function login() {
    const {login} = useAuth;
    const [from, setFrom] = useState({username:"", password:""})
    const [error, setError] = useState("")

    return (
        <div>
            <form action= ""></form>
            <h1></h1>
            <label htmlFor="">
                <span></span>
                <input type="text" />
            </label>
            <label htmlFor="">
                <span></span>
                <input type="text" />
            </label>

            <button>LOGIN</button>
        </div>
    )
}
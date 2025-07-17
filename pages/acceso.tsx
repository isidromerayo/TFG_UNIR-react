import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { setUser , setToken } from '../services/'
import { API_URL } from '../utils/'
import axios from 'axios';
import Swal from 'sweetalert2';

const Acceso: NextPage = () => {

  

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const { push } = useRouter();

  const handleInput = (e:any) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }


  const submitForm = (e:any) => {
    e.preventDefault();

    axios.post(`${API_URL}auth`, formData).then(response => {
      setToken(response.data.token);
      setUser(JSON.stringify(response.data));
      Swal.fire('Acceso', 'Logeado correctamente');
      push('/mis-cursos')
  }).catch(error => {
      Swal.fire('Problemas acceso', 'No se ha podido logear, revise usuario/contraseña', 'error');

  })

  }

  return (
    <>
      <div className="pagina-datos container">
        <h1>Acceso a tu cuenta en el portal TFG</h1>
        <div className="col-lg-8">
          <form className="form-signin" onSubmit={submitForm}>
          <div>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" name="email" onChange={handleInput} value={formData.email} className="form-control" placeholder="Email address" required autoFocus/>
            </div>
            <div>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" name="password" onChange={handleInput} value={formData.password} className="form-control" placeholder="Password" required/>
            </div>
            <div>
                <button className="btn btn-primary btn-login" type="submit">Acceso</button>
            </div>
          </form>
        </div>

      </div>
    </>
  )
}
export default Acceso
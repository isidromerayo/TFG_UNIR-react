import axios from 'axios'
import { NextPage } from 'next'
import React, {  } from 'react'
import { API_URL } from '../utils/constants'
import Swal from 'sweetalert2'

import { useForm, SubmitHandler} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useRouter } from 'next/router';

interface Inputs {
  nombre: string,
  apellidos: string,
  email: string,
  password: string,
};

const Registro: NextPage = () => {

  const router = useRouter();

  const schemaForm = Yup.object().shape({
    nombre: Yup.string().required(),
    apellidos: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required().min(4),

  })
  
  const { register, reset, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schemaForm)
  });

  const onRegister: SubmitHandler<Inputs> = async (data) => {
    try {
      // Add estado field for new users
      const userData = {
        ...data,
        estado: 'P' // P for Pending
      };

      await axios.post(`${API_URL}/usuarios`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      Swal.fire({
        title: 'Alta',
        text: 'Se ha registrado su usuario correctamente, recibirá un correo para confirmar el alta',
        icon: 'success'
      });
      router.push('/acceso');
    } catch (error: any) {
      console.error('Error en registro:', error);
      let errorMessage = 'Ha habido problemas con su registro';
      
      if (error.response?.data?.message) {
        errorMessage += ': ' + error.response.data.message;
      } else if (error.response?.data?.errors?.[0]?.message) {
        errorMessage += ': ' + error.response.data.errors[0].message;
      } else if (error.response?.status === 400) {
        errorMessage += ': Los datos proporcionados no son válidos';
      } else if (error.response?.status === 409) {
        errorMessage += ': El usuario ya existe';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += ': Tiempo de espera agotado';
      } else if (!error.response) {
        errorMessage += ': Error de conexión con el servidor. Por favor, inténtelo de nuevo.';
      }

      Swal.fire({
        title: 'Alta de usuario',
        text: errorMessage,
        icon: 'error'
      });
    }
  }

  return (
    <div className="container pagina-datos">
      <div className="col-lg-8">
        <form name="registro" className="signup-form" onSubmit={handleSubmit(onRegister)}>
          <h1 className="title">Registro de usuario</h1>
          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="nombre" className="label">Nombre (*)</label>
              <input type="text" className="form-control" {...register("nombre")}
                placeholder="indique su nombre" aria-label="indique su nombre" />
              <span className="error-form">{errors.nombre?.message}</span>
            </div>
            <div className="col-md-8 form-group">
              <label htmlFor="apellidos" className="label">Apellidos (*)</label>
              <input type="text" className="form-control"  {...register("apellidos")}
                placeholder="indique sus apellidos" aria-label="indique sus apellidos" />
              <span className="error-form">{errors.apellidos?.message}</span>

            </div>
            <div className="col-md-8 form-group">
              <label htmlFor="email" className="label">Correo electrónico (*)</label>
              <input type="email" className="form-control"  {...register("email")}
                placeholder="indique su correo electrónico" aria-label="indique su correo electrónico" />
              <span className="error-form">{errors.email?.message}</span>

            </div>
            <div className="col-md-6 form-group">
              <label htmlFor="pass" className="label">Contraseña (*)</label>
              <input type="password" className="form-control"  {...register("password")}
                placeholder="indique su contraseña" aria-label="indique su contraseña" />
              <span className="error-form">{errors.password?.message}</span>


            </div>
            <div className="col-md-8 form-group info-form">
              (*) campos obligatorios
            </div>
            <div className="text-center signup-form-button">
              <button type="submit" className="btn btn-primary" aria-label="registrarse en el portal">Registrar</button>
              <button type="button" className="btn btn-warning borrar-form"
                aria-label="limpiar formulario de registro" onClick={() => reset()}>Borrar</button>
            </div>

          </div>

        </form>
      </div>
    </div>

  )
}
export default Registro
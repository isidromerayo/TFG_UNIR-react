import axios from 'axios'
import { NextPage } from 'next'
import Link from 'next/link'
import React, { useState, FormEvent } from 'react'
import { API_URL } from '../utils/constants'
import Swal from 'sweetalert2'
import router from 'next/router'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";

const Registro: NextPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  //const router = useRouter()

  const schemaForm = Yup.object().shape({
    nombre: Yup.string().required(),
    apellidos: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required().min(4),

  })
  
  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schemaForm)
  });

  const onRegister = data => {
    console.log(data);

    try {
      //await schemaForm.validate(formData, { abortEarly: false, strict: false })
      try {
        axios.post(`${API_URL}usuarios`, data).then(response => {
          Swal.fire('Alta', 'Se ha registrado su usuario correctamente, recibirá un correo para confirmar el alta');
          router.push("/acceso")
        }).catch(error => {
          Swal.fire(
            'Alta de usuario',
            'Ha habido problemas con su registro: ' + error.response.data.message,
            'error'
          )
          console.log(error)
        })
      } catch (error) {
        console.log(error)
      }
    } catch (e: any) {
      console.dir(e)

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
                aria-label="limpiar formulario de registro">Borrar</button>
            </div>

          </div>

        </form>
      </div>
    </div>

  )
}
export default Registro
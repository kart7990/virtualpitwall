import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import * as auth from '../../../auth/authCore';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CInput,
  CLabel,
  CRow,
  CFormGroup,
  CFormText,
  CProgress
} from '@coreui/react'
import { useForm } from "react-hook-form";
import { API_URL } from '../../../apiConfig';
import axios from 'axios';

const Register = (props) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const [serverError, setServerError] = useState();

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = async data => {
    data.token = props.token
    data.provider = props.provider
    data.email = props.email

    setLoading(true)
    try {
      var registerResponse = await axios.post(`${API_URL}/authentication/registerexternal`, data);
      console.log(registerResponse)
      if (registerResponse.status === 200) {
        
        dispatch(auth.onAuthSuccess(registerResponse.data, false))
        history.push('/home')
      } else {
        setServerError("Register failed");
      }
    } catch (error) {
      setServerError("Register failed");
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!loading ?
        <CCard className="mx-4">
          <CCardBody className="p-4">
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CRow className="mt-3 mb-3">
                <CCol className="col-auto ml-auto mr-auto">
                  <h2 className="mb-3">Register</h2>
                </CCol>
              </CRow>
              <CFormGroup>
                <CLabel htmlFor="email">Email</CLabel>
                <CInput type="email" id="email" name="email" placeholder="Enter email..." autoComplete="email" disabled={true} value={props.email} readOnly innerRef={register({ required: true })} />
                <CFormText className="help-block">{errors.email && <span>Email is required</span>}</CFormText>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="name">Name (as it appears on iRacing)</CLabel>
                <CInput type="text" id="name" name="name" placeholder="Enter name..." autoComplete="name" defaultValue={props.name} innerRef={register({ required: true })} />
                <CFormText className="help-block">{errors.name && <span>Name is required</span>}</CFormText>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="name">iRacing Customer ID (found on account page)</CLabel>
                <CInput type="text" id="iracingCustomerId" name="iracingCustomerId" placeholder="Enter iRacing Customer ID" innerRef={register({ required: true })} />
                <CFormText className="help-block">{errors.iracingCustomerId && <span>iRacing Customer ID is required</span>}</CFormText>
              </CFormGroup>

              <CButton color="success" type="submit" block>Register</CButton>
              <CButton color="danger" block onClick={() => props.onCancel()}>Cancel</CButton>

            </CForm>
          </CCardBody>
        </CCard>
        :
        <CProgress animated value={100} className="mb-3" />
      }

    </>
  )
}

export default Register

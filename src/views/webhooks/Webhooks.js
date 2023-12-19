import React, { useState, useEffect } from 'react'
import { API_URL } from '../../apiConfig';
import axios from 'axios';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CInputGroup,
    CInputGroupAppend,
    CForm,
    CRow,
    CCardHeader,
    CInput
} from '@coreui/react'

const Webhooks = () => {
    const [loading, setLoading] = useState(false);
    const [webhooks, setWebhooks] = useState(null);
    const [newWebhookUrl, setNewWebhookUrl] = useState("");

    useEffect(() => {
        getWebhooks();
    }, []);

    const getWebhooks = async () => {
        setLoading(true)
        var webhooksResponse = await axios.get(`${API_URL}/webhooks`);
        setWebhooks(webhooksResponse.data)
        setLoading(false)
    }

    const addWebhook = async () => {
        if (newWebhookUrl && newWebhookUrl.length > 0) {
            var webhook = {
                url: newWebhookUrl
            }
            var createdWebhook = await axios.post(`${API_URL}/webhooks`, webhook);
            webhooks.push(createdWebhook.data)
            setWebhooks(webhooks)
            setNewWebhookUrl("")
        }
    }

    const deleteWebhook = async (id) => {
            await axios.delete(`${API_URL}/webhooks/${id}`);
            var filteredWebhooks = webhooks.filter(w => w.id !== id);
            setWebhooks(filteredWebhooks)
    }

    const renderExistingWebhooks = () => {
        if (webhooks) {
            return webhooks.map(w =>
                <CInputGroup className="pt-2" key={w.id}>
                    <CInput id="webhookUrl" name="webhookUrl" readOnly disabled placeholder="Discord Webhook URL" value={w.url} />
                    <CInputGroupAppend>
                        <CButton type="button" color="danger" onClick={() => {deleteWebhook(w.id)}}>Delete</CButton>
                    </CInputGroupAppend>
                </CInputGroup>
            )
        }
    }

    return (
        <>
            <CRow>
                <CCol md="12">
                    <CCardGroup>
                        <CCard className="p-4">
                            <CCardHeader>
                                <h1>Discord Webhooks</h1> <span>Add <a href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks" target="_blank">Discord Webhooks</a> to post notifications to a text channel when you start a pitbox session.</span>
                            </CCardHeader>
                            <CCardBody>
                                <CForm>
                                    {renderExistingWebhooks()}
                                    <CInputGroup className="pt-2">
                                        <CInput id="webhookUrl" name="webhookUrl" placeholder="Discord Webhook URL" value={newWebhookUrl} onChange={(e) => setNewWebhookUrl(e.target.value)} />
                                        <CInputGroupAppend>
                                            <CButton type="button" color="success" onClick={(e) => addWebhook()}>Add Webhook</CButton>
                                        </CInputGroupAppend>
                                    </CInputGroup>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCardGroup>
                </CCol>
            </CRow>

        </>
    )
}
export default Webhooks
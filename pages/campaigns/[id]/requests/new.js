import {useState} from 'react'; 
import { Contract, providers, utils } from "ethers";
import { Button, Form, FormField, Header, Input, Message } from "semantic-ui-react";
import Layout from "../../../../component/layout";
import CampaignJson from '../../../../Campaign.json'; 
import { useRouter } from 'next/router';

export default function NewRequest({address}){
    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')
    const [recipient, setRecipient] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter(); 

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        setLoading(true)
        if(!window.ethereum){
            alert('please install metamask')
        }
        else{
            try{
                const provider = new providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner()
                const Campaign = new Contract(address, JSON.stringify(CampaignJson.abi), signer)
                await Campaign.createRequest(description, utils.parseUnits(value, 'wei') , recipient)
                router.push(`/campaigns/${address}/requests`)
            }
            catch(error){
                setErrorMessage(error.message)
            }
        }
        setLoading(false)
    }

    return (
        <Layout>
            <Header as='h1'>
                Create a new request 
            </Header>
            <Form onSubmit={handleSubmit} error={!!errorMessage}>
                <FormField>
                    <label>Description:</label>
                    <Input onChange={(e)=>setDescription(e.target.value)}></Input>
                </FormField>
                <FormField>
                    <label>Value:</label>
                    <Input label="wei" labelPosition="right" onChange={(e)=>setValue(e.target.value)}></Input>
                </FormField>
                <FormField>
                    <label>Recipient:</label>
                    <Input label="address" labelPosition="right" onChange={(e)=>setRecipient(e.target.value)}></Input>
                </FormField>
                <Button primary loading={loading}>
                    Submit
                </Button>
                <Message error content={errorMessage}/>
            </Form>
        </Layout>
    )
}

export async function getServerSideProps({params}){
    console.log('this is params.id', params.id)
    return {
        props: {
            address: params.id
        }
    }
}
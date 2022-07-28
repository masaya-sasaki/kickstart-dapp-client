import { ethers, Contract } from 'ethers';
import {useState} from 'react'
import { Button, Form, Input, Message} from "semantic-ui-react";
import Layout from "../../component/layout";
import CampaignFactoryJson from '../../CampaignFactory.json'
import { useRouter } from 'next/router';


export default function CampaignNew(){
    const CampaignFactoryAddress = '0xF04e6744F9C47022c439754F8a0dEa6De3eE7597'
    const [errorMessage, setErrorMessage] = useState('')
    const [minContribution, setMinContribution] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter(); 

    const handleChange = (e) => {
        setMinContribution(e.target.value); 
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true)
        setErrorMessage('')
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum); 
            await provider.send("eth_requestAccounts", []); 
            const signer = await provider.getSigner(); 
            const CampaignFactory = new Contract(CampaignFactoryAddress, JSON.stringify(CampaignFactoryJson.abi), signer);
            console.log('sending transaction...')
            await CampaignFactory.createCampaign(minContribution); 
            console.log('transaction completed.')
        }
        catch(error){
            setErrorMessage(error.message); 
        }
        setLoading(false)
        router.push('/')
    }

    return (
        <Layout>
            <h1>Create a Campaign</h1>
            <Form onSubmit={handleSubmit} error={errorMessage}>
                <Form.Field>
                <label>Minimum Contribution</label>
                <Input
                value={minContribution} 
                onChange={handleChange}
                label='wei'
                labelPosition='right'
                >
                </Input>
                </Form.Field>
                <Button primary type='submit' loading={loading}>Create</Button>
                <Message
                error
                header='Oops'
                content={errorMessage}
                >
                </Message>
            </Form>
           
        </Layout>
    )
}
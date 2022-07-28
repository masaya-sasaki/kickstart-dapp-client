import {useState} from 'react'; 
import { Form, FormField, Input, Button, Message } from "semantic-ui-react"
import {providers, Contract, utils} from 'ethers'; 
import CampaignJson from '../Campaign.json'
import { useRouter } from 'next/router';

export default function ContributeForm({address}){
    const router = useRouter(); 
    const [contributeAmount, setContributeAmount] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => { 
        setContributeAmount(e.target.value);
    }

    const handleSubmission = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        setLoading(true)
        if(!window.ethereum){
            alert('please install metamask');
            setLoading(false); 
        }
        else {
            try{
                const provider = new providers.Web3Provider(window.ethereum); 
                await provider.send("eth_requestAccounts", []); 
                const signer = await provider.getSigner()
                const Campaign = new Contract(address, JSON.stringify(CampaignJson.abi), signer);
                await Campaign.contribute({ value: utils.parseUnits(contributeAmount, "wei") }); 
                router.push(`/campaigns/${address}`)
            }
            catch(error){
                setErrorMessage(error.message); 
            }
            setLoading(false); 
            setContributeAmount('')
        }
    }

    return (
        <Form onSubmit={handleSubmission} error={errorMessage}>
            <FormField>
                <label>Amount to Contribute</label>
                <Input label='wei' labelPosition="right" onChange={handleChange} value={contributeAmount}></Input>
                <Button loading={loading} primary style={{marginTop: '10px'}}>Contribute</Button>
            </FormField>
            <Message error header='Oops' content={errorMessage}>
            </Message>
        </Form>
    )
}
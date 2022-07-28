import { TableRow, TableCell, Button } from "semantic-ui-react"
import CampaignJson from '../Campaign.json'; 
import {providers, Contract} from 'ethers'; 

export default function RequestRow({address, id,description, value, recipient, approvalCount, approvers, complete}){
    const readyToFinalize = approvalCount > approvers/2 ; 
    const onApprove = async () => {
        if(!window.ethereum){
            alert('Please install Metamask'); 
        }
        else {
            const provider = new providers.Web3Provider(window.ethereum); 
            const signer = provider.getSigner()
            const Campaign = new Contract(address, JSON.stringify(CampaignJson.abi), signer)
            await Campaign.approveRequest(id)
        }
    }

    const onFinalize = async () => {
        if(!window.ethereum){
            alert('Please install Metamask'); 
        }
        else {
            const provider = new providers.Web3Provider(window.ethereum); 
            const signer = provider.getSigner()
            const Campaign = new Contract(address, JSON.stringify(CampaignJson.abi), signer)
            await Campaign.finalizeRequest(id)
        }
    }

    return (
                    <TableRow disabled={complete} positive={readyToFinalize && !complete}>
                    <TableCell>
                        {id}
                    </TableCell>
                    <TableCell>
                    {description}
                    </TableCell>
                    <TableCell>
                        {value} wei
                    </TableCell>
                    <TableCell>
                        {recipient}
                    </TableCell>
                    <TableCell>
                       {approvalCount}/{approvers}
                    </TableCell>
                    <TableCell>
                        {complete ? null : 
                        <Button color="green" basic onClick={onApprove}>
                        Approve
                    </Button>}
                    </TableCell>
                    <TableCell>
                    {complete ? null : 
                     <Button color="blue" basic onClick={onFinalize}>
                     Finalize
                 </Button>
                       }
                      
                    </TableCell>
                </TableRow>
    )
}
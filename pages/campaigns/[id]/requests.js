import { Contract, providers } from "ethers";
import Link from "next/link";
import { Button, Header, Table, TableBody, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import Layout from "../../../component/layout";
import CampaignJson from '../../../Campaign.json'
import RequestRow from "../../../component/requestRow";

export default function Requests({address, numRequests, results, approvers}){
    const renderRows = () => {
        return results.map((item, index) => {
            return <RequestRow 
            address={address}
            key={index}
            id={index}
            description={item.description}
            recipient={item.recipient}
            value={item.value}
            approvalCount={item.approvalCount}
            approvers={approvers}
            complete={item.complete}
            />
        })
    }

    return (
        <Layout>
            <Header as='h1' >Requests</Header>
            <Link href={`/campaigns/${address}/requests/new`}>
                <a>
                <Button primary floated="right" style={{marginBottom: '10px'}}
                >
                    Add Request
                </Button>
                </a>
            </Link>
            <Table>
                <TableHeader>
                    <TableHeaderCell>
                        ID
                    </TableHeaderCell>
                    <TableHeaderCell>
                        Description 
                    </TableHeaderCell>
                    <TableHeaderCell>
                        Amount 
                    </TableHeaderCell>
                    <TableHeaderCell>
                        Recipient 
                    </TableHeaderCell>
                    <TableHeaderCell>
                        Approval Count 
                    </TableHeaderCell>
                    <TableHeaderCell>
                        Approve
                    </TableHeaderCell>
                    <TableHeaderCell>
                        Finalize
                    </TableHeaderCell>
                </TableHeader>
                <TableBody>
                    {renderRows()}
                </TableBody>
            </Table>
            <div>
            Found {numRequests} requests.
            </div>
        </Layout>
    )
}

const getRequestData = async (address) => {
        const provider = new providers.AlchemyProvider(
            'goerli', 
            process.env.API_KEY
          )
        const Campaign = new Contract(address, JSON.stringify(CampaignJson.abi) ,provider)
        const response = await Campaign.requestCount(); 
        const approversResponse = await Campaign.approversCount(); 
        const approvers = approversResponse.toNumber(); 
        const numRequests = response.toNumber(); 
        let requestsObjectArray = []
        const requests = await Promise.all(
            Array(numRequests).fill().map((item,index)=>{
                return Campaign.requests(index)
            })
        )
        for(let i=0; i<numRequests;i++){
            let request = {
                description: requests[i][0],
                value: requests[i][1].toNumber(),
                recipient: requests[i][2],
                complete: requests[i][3],
                approvalCount: requests[i][4].toNumber()
            }
            requestsObjectArray.push(request)
        }
        return {numRequests, requestsObjectArray, approvers}
}

export async function getServerSideProps({params}){
    const {numRequests, requestsObjectArray, approvers} = await getRequestData(params.id)
    

    return {
        props: {
          results: requestsObjectArray, 
          numRequests: numRequests,
          address: params.id, 
          approvers: approvers
        }, 
      }
}
import {useState} from 'react'; 
import { Button, CardGroup, Grid, GridColumn, GridRow, Message} from "semantic-ui-react";
import Layout from "../../component/layout";
import {Contract, providers, BigNumber, ethers} from 'ethers'; 
import CampaignJson from '../../Campaign.json'
import ContributeForm from "../../component/contributeForm";
import Link from 'next/link';

// Dynamically rendered campaign page
// Server side pre-rendering will be done
// so by using getServerSideProps, 
// summaryInfo props will be requested in run time. 
export default function Campaigns({summaryInfo, address}){

    const renderCards = () => {
        const items = [
            {
                header: summaryInfo.manager, 
                meta: 'Address of manager',
                description: 'The manager created this campaign and can make requests to withdraw money.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: summaryInfo.balance, 
                meta: 'balance in wei',
                description: 'This is the balance for this campaign in wei.'
            },
            {
                header: summaryInfo.mincontribution, 
                meta: 'Minimum Contribution',
                description: 'This is the minimum contribution in wei that is required to become a contributor to this campaign.'
            },
            {
                header: summaryInfo.requests, 
                meta: 'Number of requests',
                description: 'This is the number of requests submitted by the manager for this campaign.'
            },
            {
                header: summaryInfo.approvers, 
                meta: 'Number of approvers',
                description: 'This is the number of approvers submitted by the manager for this campaign.'
            },
        ]
        return (
            <CardGroup items={items}/>
        )
    }

    return (
        <Layout>
            <Grid>
                <GridRow>
                    <GridColumn
                    width={10}
                    >
                        <h2>Campaign Details</h2>
                        {renderCards()}
                    </GridColumn>
                    <GridColumn
                    width={6}
                    >
                        <ContributeForm address={address} />
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <Link href={`/campaigns/${address}/requests`}>
                                <a>
                                    <Button primary>
                                    View Requests
                                    </Button>
                                </a>
                            </Link>
                    </GridRow>
            </Grid>
        </Layout>
    )
}


// an async function that uses alchemy api to access the 
// campaign contract based on the contract address campaignAddress parameter
// returns a javascript object that contains summary information of the campaign contract.
const getCampaignInfo = async (campaignAddress) => {
  const provider = new providers.AlchemyProvider(
      'goerli', 
      process.env.API_KEY
    )
  const Campaign = new Contract(campaignAddress, JSON.stringify(CampaignJson.abi), provider)        
  const summaryInfo = await Campaign.getSummaryInfo()
  // the summaryInfo returned is an array so change that into an object.
  // bignumbers will be casted to javascript numbers. 
  const summaryInfoObject = {
      'mincontribution': summaryInfo[0].toNumber(),
      'balance': summaryInfo[1].toNumber(),
      'requests': summaryInfo[2].toNumber(),
      'approvers': summaryInfo[3].toNumber(),
      'manager': summaryInfo[4]
  }

  return summaryInfoObject; 
}

// makes a query to the blockchain to gete summaryInformation
export async function getServerSideProps({params}) {
    const summaryInfo = await getCampaignInfo(params.id)
    return {
      props: {
        summaryInfo: summaryInfo, 
        address: params.id 
      }, 
    }
  }
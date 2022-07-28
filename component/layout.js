import Link from 'next/link'
import React, {useState} from 'react'
import { Container, Menu } from 'semantic-ui-react'

export default function Layout(props){

    return (
        <Container style={{'marginTop': '10px'}} >
            <Menu>
                <Link href={'/'}>
                    <a className='item'>
                    KickStarteDApp
                    </a>
                </Link>


        <Menu.Menu position='right'>
            <Link href={'/'}>
                <a className='item'>
                    Campaigns
                </a>
            </Link>
            <Link href={'/campaigns/new'}>
                <a className='item'>
                    +
                </a>
            </Link>
        </Menu.Menu>
      </Menu>
      {props.children}
        </Container>
    )
}
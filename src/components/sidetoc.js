import { graphql, useStaticQuery } from "gatsby"
import React from 'react'
import styled from '@emotion/styled'

const Sidetoc = (props) => {
    const Wrapper = styled.div`
    border-radius: 10px;
    box-shadow: 0px 0px 5px 5px rgba(82, 82, 82, 0.479);
    color: rgba(243, 230, 173, 0.821);
    background-color: rgba(243, 230, 173, 0.821);
    position: sticky;
    top: 1000px;
    `

    const TocBody = styled.div`
    padding-top: 1em;
    padding-bottom: 1em;
    margin-left: 1em;
    list-style: none;
    li::marker{
        color: rgba(0,0,0,0);
      }
    `

    if(props.tocdata == ''){
        return ( <div></div>)
    }
    return (
        <Wrapper >
            <TocBody
                className="toc__content"
                dangerouslySetInnerHTML={{
                    __html: props.tocdata,
                }}
            />
        </Wrapper>
    )
}

export default Sidetoc
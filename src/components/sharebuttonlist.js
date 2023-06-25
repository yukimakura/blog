import {
    FacebookIcon,
    FacebookShareButton,
    HatenaIcon,
    HatenaShareButton,
    LineIcon,
    LineShareButton,
    TwitterIcon,
    TwitterShareButton
  } from 'react-share'
  
  import React from 'react'
  import styled from '@emotion/styled'
  
  const Wrapper = styled.div`
    display: flex;
    padding-bottom: 24px;
  `
  
  const ButtonWrapper = styled.div`
    padding-right: 12px;
  `
  
  const ShareButtonList = ({title, url}) => {
    return (
      <Wrapper>
        <ButtonWrapper>
          <FacebookShareButton url={url}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
        </ButtonWrapper>
  
        <ButtonWrapper>
          <LineShareButton url={url} >
            <LineIcon size={40} round />
          </LineShareButton>
        </ButtonWrapper>
  
        <ButtonWrapper>
          <TwitterShareButton title={title} url={url} >
            <TwitterIcon size={40} round />
          </TwitterShareButton>
        </ButtonWrapper>
  
        <ButtonWrapper>
          <HatenaShareButton url={url} >
            <HatenaIcon size={40} round />
          </HatenaShareButton>
        </ButtonWrapper>
      </Wrapper>
    )
  }
  
  export default ShareButtonList
  
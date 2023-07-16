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
import { BrowserView, MobileView, isBrowser } from 'react-device-detect'
import { Stack, Box } from '@chakra-ui/react';

const buttonSize = isBrowser ? 40 : 55;

const ShareButtonList = ({ title, url }) => {
  return (
    <Stack direction>
        <Box>
          <FacebookShareButton url={url}>
            <FacebookIcon size={buttonSize} round />
          </FacebookShareButton>
        </Box>
        <Box>
          <LineShareButton url={url} >
            <LineIcon size={buttonSize} round />
          </LineShareButton>
        </Box>
        <Box>
          <TwitterShareButton title={title} url={url} >
            <TwitterIcon size={buttonSize} round />
          </TwitterShareButton>
        </Box>
        <Box>
          <HatenaShareButton url={url} >
            <HatenaIcon size={buttonSize} round />
          </HatenaShareButton>
        </Box>
    </Stack>
  )
}

export default ShareButtonList

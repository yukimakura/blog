/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  TwitterIcon,
  GithubIcon
} from 'next-share'

import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Stack, Box } from '@chakra-ui/react';
import { BrowserView, MobileView } from "react-device-detect"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bio">
      <Stack direction spacing='3px' justifyContent='center' >
        <Box alignContent='center'>
          <Stack spaceing='0px'>
            <BrowserView>
              <Box marginLeft='0em'>
                <StaticImage
                  className="bio-avatar"
                  layout="fixed"
                  formats={["auto", "webp", "avif"]}
                  src="../images/yukimakuraicon.jpeg"
                  width={55}
                  height={55}
                  quality={95}
                  alt="Profile picture"
                />
              </Box>
              <Box>
                <a
                  style={{
                    fontSize: `1.1em`,
                    color: `#007fff`,
                    boxShadow: `none`,
                  }}
                  href={`https://x.com/${social.twitter}`}
                >
                  {/* <FontAwesomeIcon icon={faTwitter} /> */}
                  <TwitterIcon size="1.1em" round />
                </a>
                <a
                  style={{
                    fontSize: `1.1em`,
                    color: `#000`,
                    boxShadow: `none`,
                  }}
                  href={`https://github.com/${social.github}`}
                >
                  {/* <FontAwesomeIcon icon={faGithub} /> */}
                  <GithubIcon size="1.1em" round />
                </a>
              </Box>
            </BrowserView>
          </Stack>
        </Box>
        <BrowserView>
          <Box >

            {author?.name && (
              <p>
                {author?.summary || null}<br></br>
                {` `}
                <a href="https://yukihurumakura.blogspot.com/" target="_blank" rel="noopener noreferrer">旧サイトはこちら！</a>
              </p>
            )}
          </Box>
        </BrowserView>
        <MobileView>
          <Stack>
            <Stack direction>
              <StaticImage
                className="bio-avatar"
                layout="fixed"
                formats={["auto", "webp", "avif"]}
                src="../images/yukimakuraicon.jpeg"
                width={55}
                height={55}
                quality={95}
                alt="Profile picture"
                
              />
              <Box marginTop={'-10px'} marginLeft={'-10px'}>
                <a
                  style={{
                    fontSize: `55px`,
                    color: `#007fff`,
                    boxShadow: `none`,
                  }}
                  href={`https://x.com/${social.twitter}`}
                >
                  <TwitterIcon size="55px" round />

                </a>
              </Box>
              <Box marginTop={'-10px'}>
                <a
                  style={{
                    fontSize: `55px`,
                    color: `#000`,
                    boxShadow: `none`,
                  }}
                  href={`https://github.com/${social.github}`}
                >
                  <GithubIcon size="55px" round />
                </a>
              </Box>
            </Stack>
            <Box >

              {author?.name && (
                <p>
                  <a href="https://yukihurumakura.blogspot.com/" target="_blank" rel="noopener noreferrer">旧サイトはこちら！</a>
                </p>
              )}
            </Box>
          </Stack>
        </MobileView>
      </Stack >
    </div >
  )
}

export default Bio

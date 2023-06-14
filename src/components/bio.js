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
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'

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
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/yukimakuraicon.jpeg"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
      />
      {author?.name && (
        <p>
          {author?.summary || null}<br></br>
          <a href="https://yukihurumakura.blogspot.com/">旧サイトはこちら！</a>
          {` `}
            <a
              style={{
                fontSize: `1.75em`,
                color: `#007fff`,
                boxShadow: `none`,
              }}
              href={`https://twitter.com/${social.twitter}`}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              style={{
                fontSize: `1.75em`,
                color: `#000`,
                boxShadow: `none`,
              }}
              href={`https://github.com/${social.github}`}
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
        </p>
      )}
    </div>
  )
}

export default Bio

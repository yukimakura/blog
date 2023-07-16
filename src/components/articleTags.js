import { graphql, useStaticQuery, Link } from "gatsby"
import React from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import { Stack, Box, HStack } from "@chakra-ui/react";

const ArticleTags = ({ post }) => {

    const Wrapper = styled.div`
  `


    const TagBox = styled.div`
        float: left;
    `


    return (
        <>
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && post.frontmatter.tags?.map(tag => {
                return (
                    <TagBox >
                        <Link to={"/tagpage/?tag=" + encodeURI(tag)} rel="prev" className="tag-button">
                            <FontAwesomeIcon icon={faHashtag} />
                            {" " + tag}
                        </Link>
                    </TagBox>
                )
            }
            )
            }
        </>
    )
}

export default ArticleTags


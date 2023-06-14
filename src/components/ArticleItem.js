import Img from 'gatsby-image'
import { Link } from 'gatsby'
import React from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.div

const ThumbnailWrapper = styled.div

const TitleWrapper = styled.div

const Title = styled.h3

const ArticleItem = props => {
  return (
    <Wrapper>
      <ThumbnailWrapper>
        <Link to={`/${props.slug}`}>
          <Img fluid={props.heroImage.fluid} backgroundColor={'#eeeeee'} />
        </Link>
      </ThumbnailWrapper>
      <TitleWrapper>
        <Link to={`/${props.slug}`}>
          <Title>{props.title}</Title>
        </Link>
      </TitleWrapper>
    </Wrapper>
  )
}

export default ArticleItem

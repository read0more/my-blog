import React, { useEffect, useMemo } from "react"
import { navigate, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0;
`

const Li = styled.li`
  transition: all 0.1s ease-in-out;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;

  &:hover,
  &.active {
    scale: 1.2;
  }

  &.active {
    border-bottom: 3px solid tomato;
  }
`

const Category = ({ location }) => {
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )

  const data = useStaticQuery(graphql`
    query CategoryQuery {
      allMarkdownRemark {
        nodes {
          frontmatter {
            category
          }
        }
      }
    }
  `)

  const categories = new Set(
    data.allMarkdownRemark.nodes.map(node => node.frontmatter?.category)
  )

  const handleCategoryClick = category => {
    if (!category) {
      searchParams.delete("category")
    } else {
      searchParams.set("category", category)
    }

    navigate(`/?${searchParams.toString()}`)
  }

  return (
    <Ul>
      <Li
        key="ALL"
        className={searchParams.get("category") ? "" : "active"}
        onClick={() => handleCategoryClick("")}
      >
        ALL
      </Li>
      {[...categories].map((category, index) => {
        return (
          <Li
            key={index}
            className={
              searchParams.get("category") === category ? "active" : ""
            }
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Li>
        )
      })}
    </Ul>
  )
}

export default Category

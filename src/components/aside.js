import React, { useMemo } from "react"
import { navigate, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

const Li = styled.li`
  cursor: pointer;
  font-weight: ${props => (props.active ? "bold" : "inherit")};
`

export default function Aside({ location, posts }) {
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )

  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        nodes {
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  `)

  const postCountByDate = data.allMarkdownRemark.nodes.reduce((acc, post) => {
    const date = new Date(post.frontmatter.date)
    const key = `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const countPosts = date => {
    return posts.filter(post => {
      const postDate = new Date(post.frontmatter.date)
      return (
        postDate.getFullYear() === parseInt(date.split("-")[0]) &&
        postDate.getMonth() + 1 === parseInt(date.split("-")[1])
      )
    }).length
  }

  const handleDateClick = date => {
    searchParams.set("date", date)
    navigate(`/?${searchParams.toString()}`)
  }

  return (
    <aside>
      <ul>
        {Object.entries(postCountByDate).map(([date, count]) => (
          <Li
            key={date}
            active={searchParams.get("date") === date}
            onClick={() => handleDateClick(date)}
          >
            {date} (
            {searchParams.get("date") === date ? countPosts(date) : count})
          </Li>
        ))}
      </ul>
    </aside>
  )
}

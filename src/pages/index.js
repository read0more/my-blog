import React, { useState, useEffect, useMemo } from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Aside from "../components/aside"
import Category from "../components/category"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const fullData = data.allMarkdownRemark.nodes
  const [posts, setPosts] = useState(fullData)
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )

  useEffect(() => {
    let filteredPosts = fullData
    if (searchParams.has("date")) {
      const date = searchParams.get("date")
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.frontmatter.date)
        return (
          postDate.getFullYear() === parseInt(date.split("-")[0]) &&
          postDate.getMonth() + 1 === parseInt(date.split("-")[1])
        )
      })
    }

    if (searchParams.has("category")) {
      const category = searchParams.get("category")
      filteredPosts = filteredPosts.filter(post => {
        return post.frontmatter.category === category
      })
    }

    setPosts(filteredPosts)
  }, [searchParams, data.allMarkdownRemark.nodes])

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <Category location={location} />
        <p>해당하는 글이 없습니다.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Bio />
      <Category location={location} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ol style={{ listStyle: `none` }}>
          {posts.map(post => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <Link to={post.fields.slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </article>
              </li>
            )
          })}
        </ol>
        <Aside location={location} posts={posts} />
      </div>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          category
        }
      }
    }
  }
`

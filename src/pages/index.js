import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const [posts, setPosts] = React.useState(data.allMarkdownRemark.nodes)
  const searchParams = new URLSearchParams(location.search)

  React.useEffect(() => {
    if (searchParams.has("date")) {
      const date = searchParams.get("date")
      const filteredPosts = data.allMarkdownRemark.nodes.filter(post => {
        const postDate = new Date(post.frontmatter.date)
        return (
          postDate.getFullYear() === parseInt(date.split("-")[0]) &&
          postDate.getMonth() + 1 === parseInt(date.split("-")[1])
        )
      })
      setPosts(filteredPosts)
    }
  }, [searchParams])

  const postCountByDate = data.allMarkdownRemark.nodes.reduce((acc, post) => {
    const date = new Date(post.frontmatter.date)
    const key = `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout
      location={location}
      title={siteTitle}
      postCountByDate={postCountByDate}
    >
      <Bio />
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
        <aside>
          <ul>
            {Object.entries(postCountByDate).map(([date, count]) => (
              <li key={date} style={{ cursor: "pointer" }}>
                <Link to={`/?date=${date}`}>
                  {date} ({count})
                </Link>
              </li>
            ))}
          </ul>
        </aside>
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
        }
      }
    }
  }
`

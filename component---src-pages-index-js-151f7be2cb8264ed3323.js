"use strict";(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[678],{8771:function(e,t,l){var a=l(7294),n=l(1883);t.Z=()=>{var e,t;const l=(0,n.useStaticQuery)("2630815655"),r=null===(e=l.site.siteMetadata)||void 0===e?void 0:e.author;null===(t=l.site.siteMetadata)||void 0===t||t.social;return a.createElement("div",{className:"bio"},(null==r?void 0:r.name)&&a.createElement("p",null,a.createElement("strong",null,(null==r?void 0:r.summary)||null),a.createElement("p",null,l.site.siteMetadata.description)))}},8678:function(e,t,l){var a=l(7294),n=l(1883);t.Z=e=>{let{location:t,title:l,children:r}=e;const i="/"===t.pathname;let o;return o=i?a.createElement("h1",{className:"main-heading"},a.createElement(n.Link,{to:"/"},l)):a.createElement(n.Link,{className:"header-link-home",to:"/"},l),a.createElement("div",{className:"global-wrapper","data-is-root-path":i},a.createElement("header",{className:"global-header"},o),a.createElement("main",null,r),a.createElement("footer",null,"© ",(new Date).getFullYear(),", Built with"," ",a.createElement("a",{href:"https://www.gatsbyjs.com"},"Gatsby")))}},9357:function(e,t,l){var a=l(7294),n=l(1883);t.Z=e=>{var t,l,r;let{description:i,title:o,children:c}=e;const{site:s}=(0,n.useStaticQuery)("2841359383"),m=i||s.siteMetadata.description,u=null===(t=s.siteMetadata)||void 0===t?void 0:t.title;return a.createElement(a.Fragment,null,a.createElement("title",null,u?o+" | "+u:o),a.createElement("meta",{name:"description",content:m}),a.createElement("meta",{property:"og:title",content:o}),a.createElement("meta",{property:"og:description",content:m}),a.createElement("meta",{property:"og:type",content:"website"}),a.createElement("meta",{name:"twitter:card",content:"summary"}),a.createElement("meta",{name:"twitter:creator",content:(null===(l=s.siteMetadata)||void 0===l||null===(r=l.social)||void 0===r?void 0:r.twitter)||""}),a.createElement("meta",{name:"twitter:title",content:o}),a.createElement("meta",{name:"twitter:description",content:m}),c)}},6558:function(e,t,l){l.r(t),l.d(t,{Head:function(){return c}});var a=l(7294),n=l(1883),r=l(8771),i=l(8678),o=l(9357);t.default=e=>{var t;let{data:l,location:o}=e;const c=(null===(t=l.site.siteMetadata)||void 0===t?void 0:t.title)||"Title",s=l.allMarkdownRemark.nodes;return 0===s.length?a.createElement(i.Z,{location:o,title:c},a.createElement(r.Z,null),a.createElement("p",null,'No blog posts found. Add markdown posts to "content/blog" (or the directory you specified for the "gatsby-source-filesystem" plugin in gatsby-config.js).')):a.createElement(i.Z,{location:o,title:c},a.createElement(r.Z,null),a.createElement("ol",{style:{listStyle:"none"}},s.map((e=>{const t=e.frontmatter.title||e.fields.slug;return a.createElement("li",{key:e.fields.slug},a.createElement("article",{className:"post-list-item",itemScope:!0,itemType:"http://schema.org/Article"},a.createElement("header",null,a.createElement("h2",null,a.createElement(n.Link,{to:e.fields.slug,itemProp:"url"},a.createElement("span",{itemProp:"headline"},t))),a.createElement("small",null,e.frontmatter.date)),a.createElement("section",null,a.createElement("p",{dangerouslySetInnerHTML:{__html:e.frontmatter.description||e.excerpt},itemProp:"description"}))))}))))};const c=()=>a.createElement(o.Z,{title:"All posts"})}}]);
//# sourceMappingURL=component---src-pages-index-js-151f7be2cb8264ed3323.js.map